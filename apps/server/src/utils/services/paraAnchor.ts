import { AnchorProvider, BN, Idl, Program } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import ParaServer from '@getpara/server-sdk';
import { ParaSolanaWeb3Signer } from '@getpara/solana-web3.js-v1-integration';

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { BulkCreatePredictionsDto } from 'src/games/dto/prediction.dto';
import { PredictionDirection } from 'src/games/enum/game';
import { IDL } from '../idl';
import { RalliBet } from '../idl/ralli_bet';
import { BadRequestException } from '@nestjs/common';

const CLUSTER = (process.env.SOLANA_CLUSTER as Cluster) || 'devnet';

export class ParaAnchor {
  private solanaConnection: Connection;
  private paraServer: ParaServer;
  private admin: Keypair;
  private treasury: Keypair;
  private treasuryTokenAccount: PublicKey;
  private mint: PublicKey;

  constructor(paraServer: ParaServer) {
    this.paraServer = paraServer;

    this.admin = new Keypair();
    this.mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
    this.treasury = new Keypair();

    this.solanaConnection = new Connection(clusterApiUrl(CLUSTER), 'confirmed');
  }

  // Get provider
  getProvider(): AnchorProvider {
    const solanaSigner = new ParaSolanaWeb3Signer(
      this.paraServer as any,
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

    return new Program<RalliBet>(IDL as Idl, provider);
  }

  /**
   * Returns the Solana Connection
   */
  async getConnection(): Promise<Connection> {
    return this.solanaConnection;
  }

  async createLineInstruction(
    lineId: number,
    statId: number,
    predictedValue: number,
    athleteId: number,
    startsAt: number,
    creator: PublicKey,
  ): Promise<string> {
    const program = await this.getProgram();
    const _lineId = new BN(lineId);
    const _athleteId = new BN(athleteId);
    const _startsAt = new BN(startsAt);

    const [lineAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('line'), _lineId.toArrayLike(Buffer, 'le', 8)],
      program.programId,
    );

    try {
      const ix = await program.methods
        .createLine(_lineId, statId, predictedValue, _athleteId, _startsAt)
        .accountsPartial({
          admin: creator,
          line: lineAccount,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      // Create VersionedTransaction
      const transaction = new VersionedTransaction(messageV0);

      // Sign transaction
      await program.provider.wallet?.signTransaction(transaction);

      // Send transaction
      const txSig =
        await program.provider.connection.sendTransaction(transaction);

      // Confirm transaction
      await program.provider.connection.confirmTransaction(
        {
          signature: txSig,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        'confirmed',
      );

      console.log(txSig, 'transaction signature');

      return txSig;
    } catch (error) {
      console.error('Transaction Error:', error);
      return '';
    }
  }

  async resolveLineInstruction(
    lineId: number,
    predictedValue: number,
    actualValue: number,
    shouldRefundBettors: boolean,
    creator: PublicKey,
  ): Promise<string> {
    const program = await this.getProgram();
    const _lineId = new BN(lineId);

    const [lineAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('line'), _lineId.toArrayLike(Buffer, 'le', 8)],
      program.programId,
    );

    const direction =
      actualValue > predictedValue ? { over: {} } : { under: {} };

    try {
      const ix = await program.methods
        .resolveLine(direction, actualValue, shouldRefundBettors)
        .accountsPartial({
          admin: creator,
          line: lineAccount,
        })
        .instruction();

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      // Create VersionedTransaction
      const transaction = new VersionedTransaction(messageV0);

      // Sign transaction
      await program.provider.wallet?.signTransaction(transaction);

      // Send transaction
      const txSig =
        await program.provider.connection.sendTransaction(transaction);

      // Confirm transaction
      await program.provider.connection.confirmTransaction(
        {
          signature: txSig,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        'confirmed',
      );

      console.log(txSig, 'transaction signature');

      return txSig;
    } catch (error) {
      console.error('Transaction Error:', error);
      return '';
    }
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

    const gameVault = await this.getGameVault(this.mint, gamePDA);

    const gameIdBigInt = BigInt(gameId.replace(/\D/g, '')) % 2n ** 64n;
    const gameIdBuffer = new BN(gameIdBigInt.toString());

    try {
      const ix = await program.methods
        .createGame(
          gameIdBuffer,
          maxParticipants,
          new BN(depositAmount * Math.pow(10, 6)),
          maxBet,
          creator,
        )
        .accountsStrict({
          mint: this.mint,
          creator,
          game: gamePDA,
          gameEscrow: gameEscrowPDA,
          gameVault: gameVault,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      // Create VersionedTransaction
      const transaction = new VersionedTransaction(messageV0);

      // Sign transaction
      await program.provider.wallet?.signTransaction(transaction);

      // Send transaction
      const txSig =
        await program.provider.connection.sendTransaction(transaction);

      // Confirm transaction
      await program.provider.connection.confirmTransaction(
        {
          signature: txSig,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        'confirmed',
      );

      console.log(txSig, 'transaction signature');

      return txSig;
    } catch (error) {
      console.error('Transaction Error:', error);
      return '';
    }
  }

  async joinGameInstruction({
    gameId,
    depositAmount,
  }: {
    gameId: string;
    depositAmount: number;
  }): Promise<string> {
    const program = await this.getProgram();
    const gamePDA = await this.getGamePDA(gameId, program.programId);
    const gameEscrowPDA = await this.getGameEscrowPDA(
      gamePDA,
      program.programId,
    );
    const gameVault = await this.getGameVault(this.mint, gamePDA);

    const userAta = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      program.provider.wallet?.payer as Signer,
      this.mint,
      program.provider.wallet?.publicKey as PublicKey,
    );

    const userBalance =
      await program.provider.connection.getTokenAccountBalance(userAta.address);
    const userTokenAmount = userBalance.value.uiAmount as number;
    const deposit = depositAmount * Math.pow(10, 6);
    console.log(deposit, depositAmount, 'deposit');

    // Check if balance is sufficient
    if (deposit < userTokenAmount) {
      throw new BadRequestException(
        'User does not have enough SPL tokens to join the game.',
      );
    }

    try {
      const ix = await program.methods
        .joinGame()
        .accountsStrict({
          mint: this.mint,
          user: program.provider.wallet?.publicKey as PublicKey,
          game: gamePDA,
          gameEscrow: gameEscrowPDA,
          gameVault,
          userTokens: userAta.address,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      // Create VersionedTransaction
      const transaction = new VersionedTransaction(messageV0);

      // Sign transaction
      await program.provider.wallet?.signTransaction(transaction);

      // Send transaction
      const txSig =
        await program.provider.connection.sendTransaction(transaction);

      // Confirm transaction
      await program.provider.connection.confirmTransaction(
        {
          signature: txSig,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        'confirmed',
      );

      console.log(txSig, 'transaction signature');

      return txSig;
    } catch (error) {
      console.error('Transaction Error:', error);
      return '';
    }
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
          lineId: linePDA,
          direction:
            prediction.predictedDirection === PredictionDirection.HIGHER
              ? { over: {} }
              : { under: {} },
        };
      }),
    );

    try {
      const ix = await program.methods
        .submitBet(picks)
        .accountsStrict({
          user,
          game: gamePDA,
          bet: betPDA,
          systemProgram: program.programId,
        })
        .instruction();

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      // Create VersionedTransaction
      const transaction = new VersionedTransaction(messageV0);

      // Sign transaction
      await program.provider.wallet?.signTransaction(transaction);

      // Send transaction
      const txSig =
        await program.provider.connection.sendTransaction(transaction);

      // Confirm transaction
      await program.provider.connection.confirmTransaction(
        {
          signature: txSig,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        'confirmed',
      );

      console.log(txSig, 'transaction signature');

      return txSig;
    } catch (error) {
      return '';
    }
  }

  async resolveGameInstruction(gameId: string, mint: PublicKey) {
    const program = await this.getProgram();
    const percentage = 100;

    const gamePDA = await this.getGamePDA(gameId, program.programId);
    const gameEscrow = await this.getGameEscrowPDA(gamePDA, program.programId);
    const gameVault = await this.getGameVault(mint, gamePDA);

    try {
      const ix = await program.methods
        .resolveGame(percentage, 1)
        .accountsStrict({
          admin: this.admin.publicKey,
          game: gamePDA,
          gameEscrow: gameEscrow,
          mint: this.mint,
          gameVault: gameVault,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          treasury: this.treasury.publicKey,
          treasuryVault: this.treasuryTokenAccount,
        })
        .instruction();

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      // Create VersionedTransaction
      const transaction = new VersionedTransaction(messageV0);

      // Sign transaction
      await program.provider.wallet?.signTransaction(transaction);

      // Send transaction
      const txSig =
        await program.provider.connection.sendTransaction(transaction);

      // Confirm transaction
      await program.provider.connection.confirmTransaction(
        {
          signature: txSig,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        'confirmed',
      );

      console.log(txSig, 'transaction signature');

      return txSig;
    } catch (error) {}
  }

  async cancelGameInstruction(
    gameId: string,
    mint: PublicKey,
    user: PublicKey,
  ) {
    const program = await this.getProgram();

    const gamePDA = await this.getGamePDA(gameId, program.programId);
    const gameEscrow = await this.getGameEscrowPDA(gamePDA, program.programId);
    const gameVault = await this.getGameVault(this.mint, gamePDA);

    try {
      const ix = await program.methods
        .cancelGame()
        .accountsStrict({
          adminOrUser: user,
          game: gamePDA,
          gameEscrow: gameEscrow,
          gameResult: gameVault,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();

      // Create VersionedTransaction
      const transaction = new VersionedTransaction(messageV0);

      // Sign transaction
      await program.provider.wallet?.signTransaction(transaction);

      // Send transaction
      const txSig =
        await program.provider.connection.sendTransaction(transaction);

      // Confirm transaction
      await program.provider.connection.confirmTransaction(
        {
          signature: txSig,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        'confirmed',
      );

      console.log(txSig, 'transaction signature');

      return txSig;
    } catch (error) {}
  }

  async getGamePDA(gameId: string, programId: PublicKey): Promise<PublicKey> {
    const gameIdBigInt = BigInt(gameId.replace(/\D/g, '')) % 2n ** 64n;
    const gameIdBuffer = new BN(gameIdBigInt.toString()).toArrayLike(
      Buffer,
      'le',
      8,
    );

    const [gamePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('game'), gameIdBuffer],
      programId,
    );

    return gamePDA;
  }

  async getGameVault(mint: PublicKey, gamePDA: PublicKey): Promise<PublicKey> {
    return await getAssociatedTokenAddressSync(mint, gamePDA, true);
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
