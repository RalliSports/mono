import 'dotenv/config';
import { AnchorProvider, BN, Idl, Program } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import ParaServer from '@getpara/server-sdk';
import { ParaSolanaWeb3Signer } from '@getpara/solana-web3.js-v1-integration';

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { PredictionDirection } from 'src/games/enum/game';
import { IDL } from '../idl';
import { RalliBet } from '../idl/ralli_bet';

const CLUSTER = (process.env.SOLANA_CLUSTER as Cluster) || 'devnet';
const ADMIN_KEYPAIR_JSON = process.env.ADMIN_KEYPAIR_JSON;
const secretKey = Uint8Array.from(JSON.parse(ADMIN_KEYPAIR_JSON!));
const adminKeypair = Keypair.fromSecretKey(secretKey);
export const ADMIN_WALLET_PUBLIC_KEY: PublicKey = adminKeypair.publicKey;

export class ParaAnchor {
  private solanaConnection: Connection;
  private paraServer: ParaServer;
  private admin: PublicKey;
  private treasury: PublicKey;
  private treasuryTokenAccount: PublicKey;
  private mint: PublicKey;
  private paraProvider: AnchorProvider;
  private adminProvider: AnchorProvider;

  constructor(paraServer: ParaServer) {
    this.paraServer = paraServer;

    this.admin = adminKeypair.publicKey;
    this.mint = new PublicKey('HGRipUjDcXvQ1w1NfQ2DJ33A6V8Vz5T2jU1RaTvzfqFA');
    this.treasury = new PublicKey(
      'BuxU7uwwkoobF8p4Py7nRoTgxWRJfni8fc4U3YKGEXKs',
    );
    this.treasuryTokenAccount = getAssociatedTokenAddressSync(
      this.mint,
      this.treasury,
    );

    this.solanaConnection = new Connection(clusterApiUrl(CLUSTER), 'confirmed');
  }

  // Get provider
  getProvider(useAdminSigner = false): AnchorProvider {
    // Initialize Para signer
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

    this.paraProvider = new AnchorProvider(
      this.solanaConnection,
      anchorWallet,
      {
        commitment: 'confirmed',
      },
    );

    // returnig provider based on useAdminSigner flag
    return this.paraProvider;
  }

  getServerAdminProvider(): AnchorProvider {
    // Initialize Admin signer provider
    this.adminProvider = new AnchorProvider(
      this.solanaConnection,
      new NodeWallet(adminKeypair),
      { commitment: 'confirmed' },
    );
    return this.adminProvider;
  }

  // Returns an Anchor Program instance

  async getProgram(useAdminSigner = false): Promise<Program<RalliBet>> {
    const provider = useAdminSigner
      ? this.getServerAdminProvider()
      : this.getProvider();

    return new Program<RalliBet>(IDL as Idl, provider);
  }

  //Returns the Solana Connection

  async getConnection(): Promise<Connection> {
    return this.solanaConnection;
  }

  async createMint() {
    const mint = await createMint(
      this.solanaConnection,
      adminKeypair,
      adminKeypair.publicKey,
      null,
      6,
    );
  }

  async faucetSol(user: PublicKey) {
    const provider = this.getServerAdminProvider(); // Use admin signer

    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: this.admin,
      toPubkey: user,
      lamports: (LAMPORTS_PER_SOL / 100) * 10, // Transfer 1 SOL
    });

    // Create transaction
    const transaction = new Transaction().add(transferInstruction);

    // Get latest blockhash
    const { blockhash } = await this.solanaConnection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = this.admin;

    // Sign and send transaction
    const signature = await provider.sendAndConfirm(transaction);

    return signature;
  }

  async faucetTokens(user: PublicKey) {
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      this.solanaConnection,
      adminKeypair,
      this.mint,
      user,
    );
    const tx = await mintTo(
      this.solanaConnection,
      adminKeypair,
      this.mint,
      userTokenAccount.address,
      adminKeypair.publicKey,
      10 ** (6 + 2),
    );
  }

  async createLineInstruction(
    lineId: number,
    statId: number,
    predictedValue: number,
    athleteId: number,
    startsAt: number,
    creator: PublicKey,
  ): Promise<string> {
    const program = await this.getProgram(false); // useAdminSigner
    const _lineId = new BN(lineId);
    const _athleteId = new BN(athleteId);
    const _startsAt = new BN(startsAt);

    const [lineAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('line'), _lineId.toArrayLike(Buffer, 'le', 8)],
      program.programId,
    );
    // console.log(program.provider.wallet?.publicKey, 'program provider wallet');
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
      // console.log(blockhash, 'blockhash');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToV0Message();
      // console.log(messageV0, 'messageV0');

      // Create VersionedTransaction
      const transaction = new VersionedTransaction(messageV0);
      // console.log(transaction, 'transaction');

      // Sign transaction
      await program.provider.wallet?.signTransaction(transaction);

      // Send transaction
      const txSig =
        await program.provider.connection.sendTransaction(transaction);
      // console.log(txSig, 'txSig');

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

  async bulkCreateLineInstruction(
    linesInformation: {
      timestamp: number;
      statCustomId: number;
      athleteCustomId: number;
      adjustedTimestamp: number;
      predictedValue: number;
    }[],
    creator: PublicKey,
  ): Promise<string> {
    const program = await this.getProgram(true); // useAdminSigner
    const linesIxs = [] as TransactionInstruction[];
    for (const line of linesInformation) {
      const _lineId = new BN(line.timestamp);
      const _athleteId = new BN(line.athleteCustomId);
      const _startsAt = new BN(line.adjustedTimestamp);
      const _statId = line.statCustomId;
      const _predictedValue = line.predictedValue;

      const [lineAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from('line'), _lineId.toArrayLike(Buffer, 'le', 8)],
        program.programId,
      );
      const ix = await program.methods
        .createLine(_lineId, _statId, _predictedValue, _athleteId, _startsAt)
        .accountsPartial({
          admin: creator,
          line: lineAccount,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      linesIxs.push(ix);
    }

    try {
      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: linesIxs,
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
    const program = await this.getProgram(true); // useAdminSigner
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

  async bulkResolveLineInstruction(
    linesInformation: {
      lineId: number;
      predictedValue: number;
      actualValue: number;
      shouldRefundBettors: boolean;
    }[],
    creator: PublicKey,
  ): Promise<{ success: boolean; txSig?: string; error?: string }> {
    const program = await this.getProgram(true); // useAdminSigner
    const linesIxs = [] as TransactionInstruction[];
    for (const line of linesInformation) {
      const _lineId = new BN(line.lineId);
      const _predictedValue = line.predictedValue;
      const _actualValue = line.actualValue;
      const _shouldRefundBettors = line.shouldRefundBettors;

      const [lineAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from('line'), _lineId.toArrayLike(Buffer, 'le', 8)],
        program.programId,
      );
      const direction =
        _actualValue > _predictedValue ? { over: {} } : { under: {} };
      const ix = await program.methods
        .resolveLine(direction, _actualValue, _shouldRefundBettors)
        .accountsPartial({
          admin: creator,
          line: lineAccount,
        })
        .instruction();
      linesIxs.push(ix);
    }

    try {
      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: linesIxs,
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

      return { success: true, txSig };
    } catch (error) {
      console.error('Transaction Error:', error);
      return { success: false, error: error.toString() };
    }
  }

  async createGameInstruction(
    gameId: string,
    depositAmount: number,
    maxBet: number,
    maxParticipants: number,
    creator: PublicKey,
    // mint: PublicKey,
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

  async submitBetsInstruction(
    gameId: string,
    bets: { lineId: number; direction: PredictionDirection }[],
  ): Promise<string> {
    const program = await this.getProgram();
    const gamePDA = await this.getGamePDA(gameId, program.programId);
    const betPDA = await this.getBetPDA(
      gamePDA,
      program.provider.wallet?.publicKey as PublicKey,
      program.programId,
    );

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

    const extraAccounts: any[] = [];

    const picks = await Promise.all(
      bets.map(async (prediction) => {
        const linePDA = await this.getLinePDA(
          prediction.lineId,
          program.programId,
        );

        extraAccounts.push({
          pubkey: linePDA,
          isWritable: true,
          isSigner: false,
        });

        return {
          lineId: linePDA,
          direction:
            prediction.direction === PredictionDirection.OVER
              ? { over: {} }
              : { under: {} },
        };
      }),
    );

    try {
      const joinIx = await program.methods
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

      const submitIx = await program.methods
        .submitBet(picks)
        .accountsStrict({
          user: program.provider.wallet?.publicKey as PublicKey,
          game: gamePDA,
          bet: betPDA,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts(extraAccounts)
        .instruction();

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [joinIx, submitIx],
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
      console.error(error, 'erro from submitBetsInstruction');
      return '';
    }
  }

  async resolveGameInstruction(
    gameId: string,
    winners: string[],
    userWallets: string[],
    winningLines: number[],
  ) {
    const program = await this.getProgram(true); // useAdminSigner
    const percentage = 100;

    const gamePDA = await this.getGamePDA(gameId, program.programId);

    const gameEscrow = await this.getGameEscrowPDA(gamePDA, program.programId);
    const gameVault = await this.getGameVault(this.mint, gamePDA);

    const betAccounts = await Promise.all(
      userWallets.map(async (winner) => {
        const betPDA = await this.getBetPDA(
          gamePDA,
          new PublicKey(winner),
          program.programId,
        );
        return {
          pubkey: betPDA,
          isWritable: true,
          isSigner: false,
        };
      }),
    );

    const tokenAccounts = await Promise.all(
      winners.map(async (winner) => {
        const tokenAccount = await getAssociatedTokenAddressSync(
          this.mint,
          new PublicKey(winner),
          true,
        );
        return {
          pubkey: tokenAccount,
          isWritable: true,
          isSigner: false,
        };
      }),
    );

    const lineAccounts = await Promise.all(
      winningLines.map(async (line) => {
        const linePDA = await this.getLinePDA(line, program.programId);
        return {
          pubkey: linePDA,
          isWritable: true,
          isSigner: false,
        };
      }),
    );

    // const remainingAccounts = [
    //   ...betAccounts,
    //   ...tokenAccounts,
    //   ...lineAccounts,
    // ];

    try {
      const instructions: TransactionInstruction[] = [];
      for (const betAccount of betAccounts) {
        const ix_calculate_correct = await program.methods
          .calculateCorrect()
          .accountsStrict({
            admin: program.provider.wallet?.publicKey as PublicKey,
            game: gamePDA,
            bet: betAccount.pubkey,
          })
          .remainingAccounts(lineAccounts)
          .instruction();
        instructions.push(ix_calculate_correct);
      }
      const ix_calculate_winners = await program.methods
        .calculateWinners()
        .accountsStrict({
          admin: program.provider.wallet?.publicKey as PublicKey,
          game: gamePDA,
        })
        .remainingAccounts(betAccounts)
        .instruction();
      instructions.push(ix_calculate_winners);
      const ix = await program.methods
        .resolveGame(percentage)
        .accountsStrict({
          admin: program.provider.wallet?.publicKey as PublicKey,
          game: gamePDA,
          gameEscrow: gameEscrow,
          mint: this.mint,
          gameVault: gameVault,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          treasury: this.treasury,
          treasuryVault: this.treasuryTokenAccount,
        })
        .remainingAccounts(tokenAccounts)
        .instruction();
      instructions.push(ix);
      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await program.provider.connection.getLatestBlockhash('finalized');

      // Build TransactionMessage for VersionedTransaction
      const messageV0 = new TransactionMessage({
        payerKey: program.provider.publicKey as PublicKey,
        recentBlockhash: blockhash,
        instructions: [...instructions],
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
      throw error;
    }
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
    const [betPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('bet'), gamePDA.toBuffer(), user.toBuffer()],
      programId,
    );

    return betPDA;
  }

  async getLinePDA(lineId: number, programId: PublicKey): Promise<PublicKey> {
    const [linePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('line'), new BN(lineId).toArrayLike(Buffer, 'le', 8)],
      programId,
    );

    return linePDA;
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
