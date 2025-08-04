import { AnchorProvider, BN, Idl, Program } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import ParaServer from '@getpara/server-sdk';
import { ParaSolanaWeb3Signer } from '@getpara/solana-web3.js-v1-integration';

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
import { IDL } from '../idl';
import { RalliBet } from '../idl/type';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { BulkCreatePredictionsDto } from 'src/games/dto/prediction.dto';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { PredictionDirection } from 'src/games/enum/game';

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
  async getProgram(): Promise<Program<RalliBet>> {
    const provider = await this.getProvider();
    return new Program<RalliBet>(IDL, provider);
  }

  /**
   * Returns the Solana Connection
   */
  async getConnection(): Promise<Connection> {
    return this.solanaConnection;
  }

  async createGame(
    gameId: string,
    depositAmount: number,
    maxBet: number,
    maxParticipants: number,
    creator: PublicKey,
    mint: PublicKey,
  ): Promise<string> {
    const program = await this.getProgram();

    const txn = await program.methods
      .create_game(
        new BN(gameId),
        maxParticipants,
        new BN(depositAmount),
        maxBet,
        creator,
      )
      .accounts({
        mint,
        creator,
        token_program: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return txn;
  }

  async joinGame(mint: PublicKey, user: PublicKey): Promise<string> {
    const program = await this.getProgram();
    const txn = await program.methods
      .join_game()
      .accounts({
        mint,
        user,
        token_program: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return txn;
  }

  async submitBets(
    gameId: string,
    user: PublicKey,
    bets: BulkCreatePredictionsDto,
  ): Promise<string> {
    const program = await this.getProgram();
    const gamePDA = await this.getGamePDa(new BN(gameId), program.programId);
    const betPDA = await this.getBetPDa(gamePDA, user, program.programId);

    const picks = await Promise.all(
      bets.predictions.map(async (prediction) => {
        const linePDA = await this.getLinePDa(
          new BN(prediction.lineId),
          program.programId,
        );

        return {
          line_id: linePDA,
          direction:
            prediction.predictedDirection === PredictionDirection.HIGHER
              ? { over:  {}}
              : { under: {} },
        };
      }),
    );

    const txn = await program.methods
      .submit_bet([])
      .accountsStrict({
        user,
        game: gamePDA,
        bet: betPDA,
        system_program: program.programId,
      })
      .rpc();

    return txn;
  }

  async resolveGame(gameId: string, mint: PublicKey) {
    const program = await this.getProgram();
    const percentage = 100;

    const gamePDA = await this.getGamePDa(new BN(gameId), program.programId);
    const gameEscrow = await this.getGameEscrowPDa(gamePDA, program.programId);
    const gameVault = await this.getGameVault(mint, gamePDA);

    const txn = await program.methods
      .resolve_game(percentage, 1)
      .accountsStrict({
        admin: this.admin.publicKey,
        game: gamePDA,
        game_escrow: gameEscrow,
        mint,
        game_vault: gameVault,
        system_program: SystemProgram.programId,
        associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
        token_program: TOKEN_PROGRAM_ID,
        treasury: this.treasury.publicKey,
        treasury_vault: this.treasuryTokenAccount,
      })
      .rpc();

    return txn;
  }

  async cancelGame() {
    const program = await this.getProgram();

    const txn = await program.methods.cancel_game;

    return txn;
  }

  async getGamePDa(gameId: BN, programId: PublicKey): Promise<PublicKey> {
    const [gamePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('game'), gameId.toBuffer()],
      programId,
    );

    return gamePDA;
  }

  async getGameVault(mint: PublicKey, gamePDA: PublicKey): Promise<PublicKey> {
    return getAssociatedTokenAddressSync(mint, gamePDA, true);
  }

  async getBetPDa(
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

  async getLinePDa(lineId: BN, programId: PublicKey): Promise<PublicKey> {
    const [line1PDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('line'), lineId.toBuffer()],
      programId,
    );

    return line1PDA;
  }

  async getGameEscrowPDa(
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
