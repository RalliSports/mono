import { AnchorProvider, BN, Idl, Program } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import ParaServer from '@getpara/server-sdk';
import { ParaSolanaWeb3Signer } from '@getpara/solana-web3.js-v1-integration';

import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import { BulkCreatePredictionsDto } from 'src/games/dto/prediction.dto';
import { PredictionDirection } from 'src/games/enum/game';
import { IDL } from '../idl';
import { RalliBet } from '../idl/type';

export class ParaAnchor {
  private solanaConnection: Connection;
  private paraServer: ParaServer;
  private admin: Keypair;
  private treasury: Keypair;
  private treasuryTokenAccount: PublicKey;

  constructor(paraServer: ParaServer) {
    this.paraServer = paraServer;

    this.admin = new Keypair();
    this.treasury = new Keypair();

    this.solanaConnection = new Connection(
      clusterApiUrl(process.env.SOLANA_CLUSTER as Cluster),
    );
  }

  // Get provider
  async getProvider(): Promise<AnchorProvider> {
    const solanaSigner = new ParaSolanaWeb3Signer(
      this.paraServer,
      this.solanaConnection,
    );

    const anchorWallet = {
      publicKey: solanaSigner.sender as PublicKey,
      signTransaction: async <T extends Transaction | VersionedTransaction>(
        tx: T,
      ): Promise<T> => {
        return await solanaSigner.signTransaction(tx);
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(
        txs: T[],
      ): Promise<T[]> => {
        return await Promise.all(
          txs.map((tx) => solanaSigner.signTransaction(tx)),
        );
      },
    } as NodeWallet;

    return new AnchorProvider(this.solanaConnection, anchorWallet, {
      commitment: 'confirmed',
    });
  }

  /**
   * Returns an Anchor Program instance
   */
  async getProgram(): Promise<Program<Idl>> {
    const provider = await this.getProvider();
    return new Program<Idl>(IDL, provider);
  }

  /**
   * Returns the Solana Connection
   */
  async getConnection(): Promise<Connection> {
    return this.solanaConnection;
  }

  async createGameInstruction(
    gameId: string,
    depositAmount: number,
    maxBet: number,
    maxParticipants: number,
    creator: PublicKey,
    mint: PublicKey,
  ): Promise<string> {
    const program = await this.getProgram();
    const gamePDA = await this.getGamePDA(gameId, program.programId);
    const gameEscrowPDA = await this.getGameEscrowPDA(
      gamePDA,
      program.programId,
    );

    const gameVault = await this.getGameVault(mint, gamePDA);

    try {
      const txn = await program.methods
        .createGame(
          new BN(parseInt(gameId)),
          maxParticipants,
          new BN(depositAmount),
          maxBet,
          creator,
        )
        .accountsStrict({
          mint,
          creator,
          game: gamePDA,
          gameEscrow: gameEscrowPDA,
          gameVault: gameVault,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return txn;
    } catch (error) {
      console.log(error, 'cannot create game');
      return '';
    }
  }

  async joinGameInstruction(mint: PublicKey, user: PublicKey): Promise<string> {
    const program = await this.getProgram();
    const txn = await program.methods
      .joinGame()
      .accounts({
        mint,
        user,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return txn;
  }

  async submitBetsInstruction(
    gameId: string,
    user: PublicKey,
    bets: BulkCreatePredictionsDto,
  ): Promise<string> {
    const program = await this.getProgram();
    const gamePDA = await this.getGamePDA(gameId, program.programId);
    const betPDA = await this.getBetPDA(gamePDA, user, program.programId);

    const picks = await Promise.all(
      bets.predictions.map(async (prediction) => {
        const linePDA = await this.getLinePDA(
          prediction.lineId,
          program.programId,
        );
        
        return {
          line_id: linePDA,
          direction:
            prediction.predictedDirection === PredictionDirection.HIGHER
              ? { Over: {} }
              : { Under: {} },
        };
      }),
    );

    const txn = await program.methods
      .submitBet(picks)
      .accountsStrict({
        user,
        game: gamePDA,
        bet: betPDA,
        systemProgram: program.programId,
      })
      .rpc();

    return txn;
  }

  async resolveGameInstruction(gameId: string, mint: PublicKey) {
    const program = await this.getProgram();
    const percentage = 100;

    const gamePDA = await this.getGamePDA(gameId, program.programId);
    const gameEscrow = await this.getGameEscrowPDA(gamePDA, program.programId);
    const gameVault = await this.getGameVault(mint, gamePDA);

    const txn = await program.methods
      .resolveGame(percentage, 1)
      .accountsStrict({
        admin: this.admin.publicKey,
        game: gamePDA,
        game_escrow: gameEscrow,
        mint,
        gameVault: gameVault,
        systemProgram: SystemProgram.programId,
        associatedToken_program: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        treasury: this.treasury.publicKey,
        treasuryVault: this.treasuryTokenAccount,
      })
      .rpc();

    return txn;
  }

  async cancelGameInstruction(gameId: string, mint: PublicKey, user: PublicKey) {
    const program = await this.getProgram();

    const gamePDA = await this.getGamePDA(gameId, program.programId);
    const gameEscrow = await this.getGameEscrowPDA(gamePDA, program.programId);
    const gameVault = await this.getGameVault(mint, gamePDA);

    const txn = await program.methods
      .cancelGame()
      .accountsStrict({
        adminOrUser: user,
        game: gamePDA,
        gameEscrow: gameEscrow,
        gameResult: gameVault,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return txn;
  }

  async getGamePDA(gameId: string, programId: PublicKey): Promise<PublicKey> {
  
    const [gamePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('game'), Buffer.from(parseInt(gameId).toString())],
      programId,
    );

    return gamePDA;
  }

  async getGameVault(mint: PublicKey, gamePDA: PublicKey): Promise<PublicKey> {
    return getAssociatedTokenAddressSync(mint, gamePDA, true);
  }

  async getBetPDA(
    gamePDA: PublicKey,
    user: PublicKey,
    programId: PublicKey,
  ): Promise<PublicKey> {
    const [user1BetPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('bet'), gamePDA.toBuffer(), user.toBuffer()],
      programId,
    );

    return user1BetPDA;
  }

  async getLinePDA(lineId: string, programId: PublicKey): Promise<PublicKey> {
    const [line1PDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('line'), Buffer.from(parseInt(lineId).toString())],
      programId,
    );

    return line1PDA;
  }

  async getGameEscrowPDA(
    gamePDA: PublicKey,
    programId: PublicKey,
  ): Promise<PublicKey> {
    const [gameEscrowPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), gamePDA.toBuffer()],
      programId,
    );
    return gameEscrowPDA;
  }
}
