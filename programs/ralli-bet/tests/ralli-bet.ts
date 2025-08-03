import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RalliBet } from "../target/types/ralli_bet";
import BN from "bn.js";
import * as fs from "fs";
import * as path from "path";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAssociatedTokenAddressSync,
  createMint,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { expect } from "chai";
// type Direction = anchor.IdlTypes<RalliBet>["Pick"];

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

const keypairPath = path.resolve(process.env.HOME!, ".config/solana/id.json");
const secretKey = Uint8Array.from(
  JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
);
const keypair = Keypair.fromSecretKey(secretKey);
const wallet = new anchor.Wallet(keypair);

const provider = new anchor.AnchorProvider(
  new anchor.web3.Connection("http://127.0.0.1:8899", "confirmed"),
  wallet,
  { commitment: "confirmed" }
);

anchor.setProvider(provider);
const program = anchor.workspace.RalliBet as Program<RalliBet>;

describe("RalliBet Comprehensive Tests", () => {
  const MINT_DECIMALS = 6;
  let gameId: BN;
  let createdGame: PublicKey;
  let line1PK: PublicKey;
  let line2PK: PublicKey;
  let line3PK: PublicKey;
  let line4PK: PublicKey;
  let line5PK: PublicKey;
  let line6PK: PublicKey;
  let game: PublicKey;
  let gameEscrow: PublicKey;
  let gameVault: PublicKey;
  let mint: PublicKey;
  let treasury: Keypair = Keypair.generate();

  // Test users
  let user1: Keypair;
  let user2: Keypair;
  let user3: Keypair;
  let user1TokenAccount: PublicKey;
  let user2TokenAccount: PublicKey;
  let user3TokenAccount: PublicKey;
  let providerTokenAccount: PublicKey;
  let treasuryTokenAccount: PublicKey;
  let users: Keypair[];
  let lineId1: BN = new BN(123);
  let lineId2: BN = new BN(456);
  let lineId3: BN = new BN(789);
  let lineId4: BN = new BN(1011);
  let lineId5: BN = new BN(1012);
  let lineId6: BN = new BN(1013);
  let numberOfLines = 3;
  let lineIdError: BN = new BN(1000);
  let statIdError = 0;
  let statId1 = 1;
  let statId2 = 2;
  let statId3 = 3;
  let statId4 = 4;
  let statId5 = 5;
  let statId6 = 6;
  let predictedValue1 = 17.5;
  let predictedValue2 = 22.5;
  let predictedValue3 = 57.5;
  let predictedValue4 = 100.5;
  let predictedValue5 = 10.5;
  let predictedValue6 = 10.5;
  let predictedValueError = 0;

  let athleteId1: BN = new BN(10001);
  let athleteId2: BN = new BN(10002);
  let athleteId3: BN = new BN(10003);
  let athleteId4: BN = new BN(10004);
  let athleteId5: BN = new BN(10005);
  let athleteId6: BN = new BN(10006);
  let startsAt1: BN = new BN(
    Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000)
  );

  let startsAtSoon: BN = new BN(Math.floor((Date.now() + 12000) / 1000));
  let startsAtInvalid: BN = new BN(
    Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000)
  );
  const entryFeeRaw = LAMPORTS_PER_SOL * 0.001;
  const entryFee = new BN(entryFeeRaw); // 0.001 SOL
  const entryFeePercentage = 100;
  const maxUsers = 5;

  before(async () => {
    // Generate test users
    user1 = Keypair.generate();
    user2 = Keypair.generate();
    user3 = Keypair.generate();
    users = [user1, user2, user3, treasury];

    // Airdrop SOL to test users
    for (const user of users) {
      const signature = await connection.requestAirdrop(
        user.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);
    }

    // Create mint
    mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      null,
      MINT_DECIMALS
    );

    // 600.000000 tokens
    const MINT_AMOUNT = 6 * 10 ** (MINT_DECIMALS + 2);
    user1TokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        user1,
        mint,
        user1.publicKey
      )
    ).address;

    await mintTo(
      connection,
      keypair,
      mint,
      user1TokenAccount,
      keypair.publicKey,
      MINT_AMOUNT
    );

    user2TokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        user2,
        mint,
        user2.publicKey
      )
    ).address;

    await mintTo(
      connection,
      keypair,
      mint,
      user2TokenAccount,
      keypair.publicKey,
      MINT_AMOUNT
    );

    user3TokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        user3,
        mint,
        user3.publicKey
      )
    ).address;

    await mintTo(
      connection,
      keypair,
      mint,
      user3TokenAccount,
      keypair.publicKey,
      MINT_AMOUNT
    );

    providerTokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        mint,
        keypair.publicKey
      )
    ).address;

    await mintTo(
      connection,
      keypair,
      mint,
      providerTokenAccount,
      keypair.publicKey,
      MINT_AMOUNT
    );

    treasuryTokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        treasury,
        mint,
        treasury.publicKey
      )
    ).address;
  });

  beforeEach(async () => {
    // Generate unique game ID for each test
    gameId = new BN(Math.floor(Math.random() * 1000000));

    // Derive PDAs
    [game] = PublicKey.findProgramAddressSync(
      [Buffer.from("game"), gameId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    [gameEscrow] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), game.toBuffer()],
      program.programId
    );

    gameVault = getAssociatedTokenAddressSync(mint, game, true);
  });

  describe("Create Game Tests", () => {
    it("should create a game successfully", async () => {
      const accounts = {
        creator: user1.publicKey,
        game: game,
        gameEscrow: gameEscrow,
        mint: mint,
        gameVault: gameVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      const tx = await program.methods
        .createGame(
          gameId,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial(accounts)
        .signers([user1])
        .rpc();

      // Verify game account
      const gameAccount = await program.account.game.fetch(game);
      createdGame = game;
      expect(gameAccount.gameId.toString()).to.equal(gameId.toString());
      expect(gameAccount.creator.toString()).to.equal(
        user1.publicKey.toString()
      );
      expect(gameAccount.maxUsers).to.equal(maxUsers);
      expect(gameAccount.entryFee.toString()).to.equal(entryFee.toString());
      expect(gameAccount.users).to.have.length(0);
      expect(gameAccount.status).to.deep.equal({ open: {} });

      // Verify escrow account
      const escrowAccount = await program.account.gameEscrow.fetch(gameEscrow);
      expect(escrowAccount.game.toString()).to.equal(game.toString());
      expect(escrowAccount.totalAmount.toString()).to.equal("0");
    });

    it("should fail to create game with invalid parameters", async () => {
      // Test with max_users = 1 (less than minimum)
      try {
        const accounts = {
          creator: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          mint: mint,
          gameVault: gameVault,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        };

        await program.methods
          .createGame(
            gameId,
            1,
            entryFee,
            numberOfLines,
            provider.wallet.publicKey
          )
          .accountsPartial(accounts)
          .signers([user1])
          .rpc();
        expect.fail("Should have failed with NotEnoughUsers");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: NotEnoughUsers");
      }
    });

    it("should fail to create game with zero entry fee", async () => {
      try {
        await program.methods
          .createGame(
            gameId,
            maxUsers,
            new BN(0),
            numberOfLines,
            provider.wallet.publicKey
          )
          .accountsPartial({
            creator: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .signers([user1])
          .rpc();
        expect.fail("Should have failed with InvalidEntryFee");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: InvalidEntryFee");
      }
    });

    it("should fail to create game with too many max users", async () => {
      try {
        await program.methods
          .createGame(
            gameId,
            51,
            entryFee,
            numberOfLines,
            provider.wallet.publicKey
          )
          .accountsPartial({
            creator: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .signers([user1])
          .rpc();
        expect.fail("Should have failed with GameFull");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: GameFull");
      }
    });

    it("should fail to create game with too few lines", async () => {
      try {
        await program.methods
          .createGame(gameId, maxUsers, entryFee, 1, provider.wallet.publicKey)
          .accountsPartial({
            creator: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .signers([user1])
          .rpc();
        expect.fail("Should have failed with TooFewLines");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: TooFewLines");
      }
    });
    it("should fail to create game with too many lines", async () => {
      try {
        await program.methods
          .createGame(
            gameId,
            maxUsers,
            entryFee,
            100,
            provider.wallet.publicKey
          )
          .accountsPartial({
            creator: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .signers([user1])
          .rpc();
        expect.fail("Should have failed with TooManyLines");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: TooManyLines");
      }
    });
  });

  describe("Create Line Tests", () => {
    it("should create a lines successfully", async () => {
      const [line1] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), lineId1.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [line2] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), lineId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [line3] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), lineId3.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [line4] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), lineId4.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [line5] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), lineId5.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [line6] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), lineId6.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const tx = await program.methods
        .createLine(lineId1, statId1, predictedValue1, athleteId1, startsAt1)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line1,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      // Verify game account
      const lineAccount = await program.account.line.fetch(line1);
      expect(lineAccount.statId).to.equal(statId1);
      expect(lineAccount.predictedValue).to.equal(predictedValue1);
      expect(lineAccount.athleteId.toString()).to.equal(athleteId1.toString());
      expect(lineAccount.startsAt.toString()).to.equal(startsAt1.toString());
      expect(lineAccount.result).to.equal(null);
      expect(lineAccount.shouldRefundBettors).to.equal(false);
      expect(lineAccount.actualValue).to.equal(null);

      const tx2 = await program.methods
        .createLine(lineId2, statId2, predictedValue2, athleteId2, startsAt1)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line2,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx3 = await program.methods
        .createLine(lineId3, statId3, predictedValue3, athleteId3, startsAt1)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line3,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx4 = await program.methods
        .createLine(lineId4, statId4, predictedValue4, athleteId4, startsAt1)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line4,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx5 = await program.methods
        .createLine(lineId5, statId5, predictedValue5, athleteId5, startsAtSoon)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line5,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx6 = await program.methods
        .createLine(lineId6, statId6, predictedValue6, athleteId6, startsAtSoon)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line6,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
      line1PK = line1;
      line2PK = line2;
      line3PK = line3;
      line4PK = line4;
      line5PK = line5;
      line6PK = line6;
    });

    it("should fail to create line with invalid parameters - not admin", async () => {
      // Test with max_users = 1 (less than minimum)
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineIdError.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        const tx = await program.methods
          .createLine(
            lineIdError,
            statId1,
            predictedValue1,
            athleteId1,
            startsAtInvalid
          )
          .accountsPartial({
            admin: user1.publicKey,
            line: lineError,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();
        expect.fail("Should have failed with UnauthorizedLineCreation");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: UnauthorizedLineCreation"
        );
      }
    });

    it("should fail to create line with invalid parameters - startsAt in the past", async () => {
      // Test with max_users = 1 (less than minimum)
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineIdError.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        const tx = await program.methods
          .createLine(
            lineIdError,
            statId1,
            predictedValue1,
            athleteId1,
            startsAtInvalid
          )
          .accountsPartial({
            admin: provider.wallet.publicKey,
            line: lineError,
            systemProgram: SystemProgram.programId,
          })
          .signers([keypair])
          .rpc();
        expect.fail("Should have failed with InvalidLineStartTime");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: InvalidLineStartTime");
      }
    });

    it("should fail to create line with invalid parameters - invalid predicted value", async () => {
      // Test with max_users = 1 (less than minimum)
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineIdError.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        const tx = await program.methods
          .createLine(
            lineIdError,
            statId1,
            predictedValueError,
            athleteId1,
            startsAt1
          )
          .accountsPartial({
            admin: provider.wallet.publicKey,
            line: lineError,
            systemProgram: SystemProgram.programId,
          })
          .signers([keypair])
          .rpc();
        expect.fail("Should have failed with InvalidPredictedValue");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: InvalidPredictedValue"
        );
      }
    });
    it("should fail to create line with invalid parameters - invalid statId", async () => {
      // Test with max_users = 1 (less than minimum)
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineIdError.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        const tx = await program.methods
          .createLine(
            lineIdError,
            statIdError,
            predictedValue1,
            athleteId1,
            startsAt1
          )
          .accountsPartial({
            admin: provider.wallet.publicKey,
            line: lineError,
            systemProgram: SystemProgram.programId,
          })
          .signers([keypair])
          .rpc();
        expect.fail("Should have failed with InvalidStatId");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: InvalidStatId");
      }
    });
  });

  describe("Join Game Tests", () => {
    beforeEach(async () => {
      // Create a game before each join test
      const tx = await program.methods
        .createGame(
          gameId,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([user1])
        .rpc();
    });

    it("should allow user to join game successfully", async () => {
      const userBalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const vaultBalanceBefore = await connection.getTokenAccountBalance(
        gameVault
      );

      const tx = await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // Verify balances
      const userBalanceAfter = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const vaultBalanceAfter = await connection.getTokenAccountBalance(
        gameVault
      );

      expect(
        userBalanceBefore.value.uiAmount! - userBalanceAfter.value.uiAmount!
      ).to.equal(entryFee.toNumber() / Math.pow(10, 6));
      expect(
        vaultBalanceAfter.value.uiAmount! - vaultBalanceBefore.value.uiAmount!
      ).to.equal(entryFee.toNumber() / Math.pow(10, 6));

      // Verify game state
      const gameAccount = await program.account.game.fetch(game);
      expect(gameAccount.users).to.have.length(1);
      expect(gameAccount.users[0].toString()).to.equal(
        user1.publicKey.toString()
      );

      // Verify escrow state
      const escrowAccount = await program.account.gameEscrow.fetch(gameEscrow);
      expect(escrowAccount.totalAmount.toString()).to.equal(
        entryFee.toString()
      );
    });

    it("should allow multiple users to join", async () => {
      // User 1 joins
      await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // User 2 joins
      await program.methods
        .joinGame()
        .accountsPartial({
          user: user2.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          mint: mint,
          userTokens: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();

      const gameAccount = await program.account.game.fetch(game);
      expect(gameAccount.users).to.have.length(2);
      expect(gameAccount.users[0].toString()).to.equal(
        user1.publicKey.toString()
      );
      expect(gameAccount.users[1].toString()).to.equal(
        user2.publicKey.toString()
      );

      const escrowAccount = await program.account.gameEscrow.fetch(gameEscrow);
      expect(escrowAccount.totalAmount.toString()).to.equal(
        entryFee.mul(new BN(2)).toString()
      );
    });

    it("should allow creator to join their own game", async () => {
      await program.methods
        .joinGame()
        .accountsPartial({
          user: provider.wallet.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          userTokens: providerTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
    });

    it("should prevent user from joining twice", async () => {
      // First join
      await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // Second join attempt
      try {
        await program.methods
          .joinGame()
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            userTokens: user1TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();
        expect.fail("Should have failed with UserAlreadyJoined");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: UserAlreadyJoined");
      }
    });

    it("should prevent joining when game is full", async () => {
      // Create a game with max 2 users for this test
      const smallGameId = new BN(Math.floor(Math.random() * 1000000));
      const [smallGame] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), smallGameId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [smallGameEscrow] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), smallGame.toBuffer()],
        program.programId
      );
      const smallGameVault = getAssociatedTokenAddressSync(
        mint,
        smallGame,
        true
      );

      await program.methods
        .createGame(
          smallGameId,
          2,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: provider.wallet.publicKey,
          game: smallGame,
          gameEscrow: smallGameEscrow,
          gameVault: smallGameVault,
          mint: mint,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([keypair])
        .rpc();

      // Fill the game
      await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: smallGame,
          gameEscrow: smallGameEscrow,
          gameVault: smallGameVault,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      await program.methods
        .joinGame()
        .accountsPartial({
          user: user2.publicKey,
          game: smallGame,
          gameEscrow: smallGameEscrow,
          gameVault: smallGameVault,
          mint: mint,
          userTokens: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();

      // Try to join when full
      try {
        await program.methods
          .joinGame()
          .accountsPartial({
            user: user3.publicKey,
            game: smallGame,
            gameEscrow: smallGameEscrow,
            gameVault: smallGameVault,
            mint: mint,
            userTokens: user3TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user3])
          .rpc();
        expect.fail("Should have failed with GameFull");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: GameFull");
      }
    });
  });

  describe("Submit Bet Tests", () => {
    beforeEach(async () => {
      // Create a game before each join test
      const tx = await program.methods
        .createGame(
          gameId,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
    });

    it("should allow user to submit bet successfully", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      const tx2 = await program.methods
        .submitBet([
          {
            lineId: line1PK,
            direction: { over: {} },
          },
          {
            lineId: line2PK,
            direction: { under: {} },
          },
          {
            lineId: line3PK,
            direction: { over: {} },
          },
        ])
        .accountsPartial({
          user: user1.publicKey,
          game: game,
          bet: bet,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .remainingAccounts([
          {
            pubkey: line1PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: line2PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: line3PK,
            isWritable: false,
            isSigner: false,
          },
        ])
        .rpc();

      const betAccount = await program.account.bet.fetch(bet);
      expect(betAccount.picks).to.have.length(3);
      expect(betAccount.picks[0].lineId.toString()).to.equal(
        line1PK.toString()
      );
      expect(betAccount.picks[0].direction).to.deep.equal({ over: {} });
      expect(betAccount.picks[1].lineId.toString()).to.equal(
        line2PK.toString()
      );
      expect(betAccount.picks[1].direction).to.deep.equal({ under: {} });
      expect(betAccount.picks[2].lineId.toString()).to.equal(
        line3PK.toString()
      );
      expect(betAccount.picks[2].direction).to.deep.equal({ over: {} });
      expect(betAccount.correctCount).to.equal(0);
      const gameAccount = await program.account.game.fetch(game);

      expect(gameAccount.involvedLines).to.have.length(3);
      expect(gameAccount.involvedLines[0].toString()).to.equal(
        line1PK.toString()
      );
      expect(gameAccount.involvedLines[1].toString()).to.equal(
        line2PK.toString()
      );
      expect(gameAccount.involvedLines[2].toString()).to.equal(
        line3PK.toString()
      );
    });

    it("should allow user to submit bet successfully with other lines", async () => {
      // First, submit a bet with lines 1, 2, 3 (like the previous test)
      const [bet1] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      await program.methods
        .submitBet([
          {
            lineId: line1PK,
            direction: { over: {} },
          },
          {
            lineId: line2PK,
            direction: { under: {} },
          },
          {
            lineId: line3PK,
            direction: { over: {} },
          },
        ])
        .accountsPartial({
          user: user1.publicKey,
          game: game,
          bet: bet1,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .remainingAccounts([
          { pubkey: line1PK, isWritable: false, isSigner: false },
          { pubkey: line2PK, isWritable: false, isSigner: false },
          { pubkey: line3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      // Now submit a second bet with lines 1, 2, 4
      const [bet2] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user2.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .joinGame()
        .accountsPartial({
          user: user2.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          gameVault: gameVault,
          mint: mint,
          userTokens: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();

      await program.methods
        .submitBet([
          {
            lineId: line1PK,
            direction: { over: {} },
          },
          {
            lineId: line2PK,
            direction: { under: {} },
          },
          {
            lineId: line4PK,
            direction: { under: {} },
          },
        ])
        .accountsPartial({
          user: user2.publicKey,
          game: game,
          bet: bet2,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .remainingAccounts([
          { pubkey: line1PK, isWritable: false, isSigner: false },
          { pubkey: line2PK, isWritable: false, isSigner: false },
          { pubkey: line4PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const betAccount = await program.account.bet.fetch(bet2);
      expect(betAccount.picks).to.have.length(3);
      expect(betAccount.picks[0].lineId.toString()).to.equal(
        line1PK.toString()
      );
      expect(betAccount.picks[0].direction).to.deep.equal({ over: {} });
      expect(betAccount.picks[1].lineId.toString()).to.equal(
        line2PK.toString()
      );
      expect(betAccount.picks[1].direction).to.deep.equal({ under: {} });
      expect(betAccount.picks[2].lineId.toString()).to.equal(
        line4PK.toString()
      );
      expect(betAccount.picks[2].direction).to.deep.equal({ under: {} });
      expect(betAccount.correctCount).to.equal(0);

      const gameAccount = await program.account.game.fetch(game);
      expect(gameAccount.involvedLines).to.have.length(4);
      expect(gameAccount.involvedLines[0].toString()).to.equal(
        line1PK.toString()
      );
      expect(gameAccount.involvedLines[1].toString()).to.equal(
        line2PK.toString()
      );
      expect(gameAccount.involvedLines[2].toString()).to.equal(
        line3PK.toString()
      );
      expect(gameAccount.involvedLines[3].toString()).to.equal(
        line4PK.toString()
      );
    });

    // TODO, TEST CANNOT SUBMIT BET ON CLOSED GAME

    it("should prevent user from submitting bet before joining game", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      const gameAccount = await program.account.game.fetch(game);
      expect(gameAccount.users).to.have.length(0);

      try {
        const tx = await program.methods
          .submitBet([
            {
              lineId: line1PK,
              direction: { over: {} },
            },
            {
              lineId: line2PK,
              direction: { under: {} },
            },
            {
              lineId: line3PK,
              direction: { over: {} },
            },
          ])
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            bet: bet,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .remainingAccounts([
            {
              pubkey: line1PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line2PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line3PK,
              isWritable: false,
              isSigner: false,
            },
          ])
          .rpc();
        expect.fail("Should have failed with UserNotInGame");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: UserNotInGame");
      }
    });

    it("should prevent user submitting bet with wrong number of lines", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );
      try {
        const tx = await program.methods
          .joinGame()
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            userTokens: user1TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();

        const tx2 = await program.methods
          .submitBet([
            {
              lineId: line1PK,
              direction: { over: {} },
            },
            {
              lineId: line2PK,
              direction: { under: {} },
            },
            {
              lineId: line3PK,
              direction: { over: {} },
            },

            {
              lineId: line4PK,
              direction: { over: {} },
            },
          ])
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            bet: bet,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .remainingAccounts([
            {
              pubkey: line1PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line2PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line3PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line4PK,
              isWritable: false,
              isSigner: false,
            },
          ])
          .rpc();
        expect.fail("Should have failed with InvalidPickCount");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: InvalidPickCount");
      }
    });

    it("should prevent user submitting bet with wrong size of remaning accounts", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );
      try {
        const tx = await program.methods
          .joinGame()
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            userTokens: user1TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();

        const tx2 = await program.methods
          .submitBet([
            {
              lineId: line1PK,
              direction: { over: {} },
            },
            {
              lineId: line2PK,
              direction: { under: {} },
            },
            {
              lineId: line3PK,
              direction: { over: {} },
            },
          ])
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            bet: bet,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .remainingAccounts([
            {
              pubkey: line1PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line2PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line3PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line4PK,
              isWritable: false,
              isSigner: false,
            },
          ])
          .rpc();
        expect.fail("Should have failed with PicksLinesMismatch");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: PicksLinesMismatch");
      }
    });

    it("should prevent user submitting bet with wrong PK in remaining accounts", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );
      try {
        const tx = await program.methods
          .joinGame()
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            userTokens: user1TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();

        const tx2 = await program.methods
          .submitBet([
            {
              lineId: line1PK,
              direction: { over: {} },
            },
            {
              lineId: line2PK,
              direction: { under: {} },
            },
            {
              lineId: line3PK,
              direction: { over: {} },
            },
          ])
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            bet: bet,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .remainingAccounts([
            {
              pubkey: line1PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line2PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line4PK,
              isWritable: false,
              isSigner: false,
            },
          ])
          .rpc();
        expect.fail("Should have failed with LineMismatch");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: LineMismatch");
      }
    });

    it("should prevent user submitting bet with line that has already started", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );
      try {
        expect(startsAtSoon.toNumber()).to.be.lessThan(
          Math.floor(Date.now() / 1000)
        );
        const tx = await program.methods
          .joinGame()
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            gameEscrow: gameEscrow,
            gameVault: gameVault,
            mint: mint,
            userTokens: user1TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();

        const tx2 = await program.methods
          .submitBet([
            {
              lineId: line1PK,
              direction: { over: {} },
            },
            {
              lineId: line2PK,
              direction: { under: {} },
            },
            {
              lineId: line5PK,
              direction: { over: {} },
            },
          ])
          .accountsPartial({
            user: user1.publicKey,
            game: game,
            bet: bet,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .remainingAccounts([
            {
              pubkey: line1PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line2PK,
              isWritable: false,
              isSigner: false,
            },
            {
              pubkey: line5PK,
              isWritable: false,
              isSigner: false,
            },
          ])
          .rpc();
        expect.fail("Should have failed with LineAlreadyStarted");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: LineAlreadyStarted");
      }
    });
  });

  describe("Resolve Line Tests", () => {
    it("should prevent resolution with wrong direction", async () => {
      try {
        const tx = await program.methods
          .resolveLine({ under: {} }, 19.0, false)
          .accountsPartial({
            admin: provider.wallet.publicKey,
            line: line5PK,
          })
          .signers([keypair])
          .rpc();
        expect.fail("Should have failed with DirectionMismatch");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: DirectionMismatch");
      }
    });

    it("should prevent resolution with wrong direction 2", async () => {
      try {
        const tx = await program.methods
          .resolveLine({ over: {} }, 9.0, false)
          .accountsPartial({
            admin: provider.wallet.publicKey,
            line: line5PK,
          })
          .signers([keypair])
          .rpc();
        expect.fail("Should have failed with DirectionMismatch");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: DirectionMismatch");
      }
    });

    it("should allow admin to resolve line successfully", async () => {
      const tx = await program.methods
        .resolveLine({ over: {} }, 19.0, false)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line5PK,
        })
        .signers([keypair])
        .rpc();

      const resolvedLine = await program.account.line.fetch(line5PK);
      expect(resolvedLine.result).to.deep.equal({ over: {} });
      expect(resolvedLine.actualValue).to.equal(19.0);
      expect(resolvedLine.shouldRefundBettors).to.equal(false);
    });

    it("should prevent admin from resolving line that has already been resolved", async () => {
      try {
        const tx = await program.methods
          .resolveLine({ over: {} }, 19.0, false)
          .accountsPartial({
            admin: provider.wallet.publicKey,
            line: line5PK,
          })
          .signers([keypair])
          .rpc();
        expect.fail("Should have failed with LineAlreadyResolved");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: LineAlreadyResolved");
      }
    });

    it("should prevent admin from resolving line that has not started yet", async () => {
      try {
        const tx = await program.methods
          .resolveLine({ over: {} }, 19.0, false)
          .accountsPartial({
            admin: provider.wallet.publicKey,
            line: line1PK,
          })
          .signers([keypair])
          .rpc();
        expect.fail("Should have failed with LineNotStarted");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: LineNotStarted");
      }
    });

    it("should prevent non-admin from resolving line", async () => {
      try {
        const tx = await program.methods
          .resolveLine({ over: {} }, 19.0, false)
          .accountsPartial({
            admin: user1.publicKey,
            line: line1PK,
          })
          .signers([user1])
          .rpc();
        expect.fail("Should have failed with UnauthorizedLineResolution");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: UnauthorizedLineResolution"
        );
      }
    });

    it("should allow admin to mark started line as refundable", async () => {
      const tx = await program.methods
        .resolveLine({ over: {} }, 19.0, true)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line6PK,
        })
        .signers([keypair])
        .rpc();

      const resolvedLine = await program.account.line.fetch(line6PK);
      expect(resolvedLine.shouldRefundBettors).to.equal(true);
    });

    it("should allow admin to mark not-started line as refundable", async () => {
      const tx = await program.methods
        .resolveLine({ over: {} }, 19.0, true)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: line1PK,
        })
        .signers([keypair])
        .rpc();

      const resolvedLine = await program.account.line.fetch(line1PK);
      expect(resolvedLine.shouldRefundBettors).to.equal(true);
    });

    it("should prevent admin from resolving line marked as refundable", async () => {
      try {
        const tx = await program.methods
          .resolveLine({ over: {} }, 19.0, false)
          .accountsPartial({
            admin: provider.wallet.publicKey,
            line: line6PK,
          })
          .signers([keypair])
          .rpc();
        expect.fail("Should have failed with LineShouldBeRefunded");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: LineShouldBeRefunded");
      }
    });
  });

  describe("Resolve Game Tests", () => {
    let newGame1PK: PublicKey;
    let newGame2PK: PublicKey;
    let newGame3PK: PublicKey;
    let newGame4PK: PublicKey;
    let newGame5PK: PublicKey;
    let newGame6PK: PublicKey;

    let newGameEscrow1PK: PublicKey;
    let newGameEscrow2PK: PublicKey;
    let newGameEscrow3PK: PublicKey;
    let newGameEscrow4PK: PublicKey;
    let newGameEscrow5PK: PublicKey;
    let newGameEscrow6PK: PublicKey;

    let newGameVault1PK: PublicKey;
    let newGameVault2PK: PublicKey;
    let newGameVault3PK: PublicKey;
    let newGameVault4PK: PublicKey;
    let newGameVault5PK: PublicKey;
    let newGameVault6PK: PublicKey;

    let newLine1PK: PublicKey;
    let newLine2PK: PublicKey;
    let newLine3PK: PublicKey;
    let newLine4PK: PublicKey;
    let newLine5PK: PublicKey;
    let newLine6PK: PublicKey;

    let newLineId1 = new BN(2000);
    let newLineId2 = new BN(2001);
    let newLineId3 = new BN(2002);
    let newLineId4 = new BN(2003);
    let newLineId5 = new BN(2004);
    let newLineId6 = new BN(2005);

    let newBet1Game1: PublicKey;
    let newBet2Game1: PublicKey;

    let newBet1Game2: PublicKey;
    let newBet2Game2: PublicKey;

    before(async () => {
      let newStartsSoonRaw = Date.now() + 12000;
      let newStartsSoon = new BN(Math.floor(newStartsSoonRaw / 1000));
      const [newLine1] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), newLineId1.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newLine2] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), newLineId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newLine3] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), newLineId3.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newLine4] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), newLineId4.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newLine5] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), newLineId5.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newLine6] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), newLineId6.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const tx = await program.methods
        .createLine(
          newLineId1,
          statId1,
          predictedValue1,
          athleteId1,
          newStartsSoon
        )
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine1,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx2 = await program.methods
        .createLine(
          newLineId2,
          statId2,
          predictedValue2,
          athleteId2,
          newStartsSoon
        )
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine2,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx3 = await program.methods
        .createLine(
          newLineId3,
          statId3,
          predictedValue3,
          athleteId3,
          newStartsSoon
        )
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine3,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx4 = await program.methods
        .createLine(
          newLineId4,
          statId4,
          predictedValue4,
          athleteId4,
          newStartsSoon
        )
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine4,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx5 = await program.methods
        .createLine(
          newLineId5,
          statId5,
          predictedValue5,
          athleteId5,
          newStartsSoon
        )
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine5,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      const tx6 = await program.methods
        .createLine(
          newLineId6,
          statId6,
          predictedValue6,
          athleteId6,
          newStartsSoon
        )
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine6,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
      newLine1PK = newLine1;
      newLine2PK = newLine2;
      newLine3PK = newLine3;
      newLine4PK = newLine4;
      newLine5PK = newLine5;
      newLine6PK = newLine6;

      const newGameId1 = new BN(2001);

      const [newGame1] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), newGameId1.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newGameEscrow1] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), newGame1.toBuffer()],
        program.programId
      );

      const newGameVault1 = getAssociatedTokenAddressSync(mint, newGame1, true);

      const txCreateGame1 = await program.methods
        .createGame(
          newGameId1,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: newGame1,
          gameEscrow: newGameEscrow1,
          gameVault: newGameVault1,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      const txJoinGame1User1 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: newGame1,
          gameEscrow: newGameEscrow1,
          gameVault: newGameVault1,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      [newBet1Game1] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame1.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet1Game1 = await program.methods
        .submitBet([
          {
            lineId: newLine1PK,
            direction: { over: {} },
          },
          {
            lineId: newLine2PK,
            direction: { under: {} },
          },
          {
            lineId: newLine3PK,
            direction: { over: {} },
          },
        ])
        .accountsPartial({
          user: user1.publicKey,
          game: newGame1,
          bet: newBet1Game1,
        })
        .signers([user1])
        .remainingAccounts([
          {
            pubkey: newLine1PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine2PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine3PK,
            isWritable: false,
            isSigner: false,
          },
        ])
        .rpc();

      const txJoinGame1User2 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user2.publicKey,
          game: newGame1,
          gameEscrow: newGameEscrow1,
          gameVault: newGameVault1,
          mint: mint,
          userTokens: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();

      [newBet2Game1] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame1.toBuffer(), user2.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet2Game1 = await program.methods
        .submitBet([
          {
            lineId: newLine1PK,
            direction: { under: {} },
          },
          {
            lineId: newLine2PK,
            direction: { over: {} },
          },
          {
            lineId: newLine3PK,
            direction: { under: {} },
          },
        ])
        .accountsPartial({
          user: user2.publicKey,
          game: newGame1,
          bet: newBet2Game1,
        })
        .signers([user2])
        .remainingAccounts([
          {
            pubkey: newLine1PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine2PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine3PK,
            isWritable: false,
            isSigner: false,
          },
        ])
        .rpc();

      newGame1PK = newGame1;
      newGameEscrow1PK = newGameEscrow1;
      newGameVault1PK = newGameVault1;

      const newGameId2 = new BN(2002);

      const [newGame2] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), newGameId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newGameEscrow2] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), newGame2.toBuffer()],
        program.programId
      );

      const newGameVault2 = getAssociatedTokenAddressSync(mint, newGame2, true);

      const txCreateGame2 = await program.methods
        .createGame(
          newGameId2,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: newGame2,
          gameEscrow: newGameEscrow2,
          gameVault: newGameVault2,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      const txJoinGame2User1 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: newGame2,
          gameEscrow: newGameEscrow2,
          gameVault: newGameVault2,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      [newBet1Game2] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame2.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet1Game2 = await program.methods
        .submitBet([
          {
            lineId: newLine1PK,
            direction: { under: {} },
          },
          {
            lineId: newLine2PK,
            direction: { over: {} },
          },
          {
            lineId: newLine3PK,
            direction: { over: {} },
          },
        ])
        .accountsPartial({
          user: user1.publicKey,
          game: newGame2,
          bet: newBet1Game2,
        })
        .signers([user1])
        .remainingAccounts([
          {
            pubkey: newLine1PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine2PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine3PK,
            isWritable: false,
            isSigner: false,
          },
        ])
        .rpc();

      const txJoinGame2User2 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user2.publicKey,
          game: newGame2,
          gameEscrow: newGameEscrow2,
          gameVault: newGameVault2,
          mint: mint,
          userTokens: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();

      [newBet2Game2] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame2.toBuffer(), user2.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet2Game2 = await program.methods
        .submitBet([
          {
            lineId: newLine1PK,
            direction: { under: {} },
          },
          {
            lineId: newLine2PK,
            direction: { under: {} },
          },
          {
            lineId: newLine3PK,
            direction: { under: {} },
          },
        ])
        .accountsPartial({
          user: user2.publicKey,
          game: newGame2,
          bet: newBet2Game2,
        })
        .signers([user2])
        .remainingAccounts([
          {
            pubkey: newLine1PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine2PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine3PK,
            isWritable: false,
            isSigner: false,
          },
        ])
        .rpc();

      newGame2PK = newGame2;
      newGameEscrow2PK = newGameEscrow2;
      newGameVault2PK = newGameVault2;

      const timeToWait = newStartsSoonRaw - Date.now();

      await new Promise((resolve) => setTimeout(resolve, timeToWait + 2000));

      const txResolveNewLine1 = await program.methods
        .resolveLine({ over: {} }, 19.0, false)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine1PK,
        })
        .signers([keypair])
        .rpc();

      const txResolveNewLine2 = await program.methods
        .resolveLine({ under: {} }, 10.0, false)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine2PK,
        })
        .signers([keypair])
        .rpc();

      const txResolveNewLine3 = await program.methods
        .resolveLine({ over: {} }, 60.0, false)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine3PK,
        })
        .signers([keypair])
        .rpc();

      const txResolveNewLine4 = await program.methods
        .resolveLine({ under: {} }, 19.0, false)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine4PK,
        })
        .signers([keypair])
        .rpc();

      const txResolveNewLine5 = await program.methods
        .resolveLine({ over: {} }, 19.0, false)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine5PK,
        })
        .signers([keypair])
        .rpc();

      const txResolveNewLine6 = await program.methods
        .resolveLine({ under: {} }, 9.0, false)
        .accountsPartial({
          admin: provider.wallet.publicKey,
          line: newLine6PK,
        })
        .signers([keypair])
        .rpc();
    });

    it("should successfully resolve game between two users where one wins", async () => {
      const user1BalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user2BalanceBefore = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const treasuryBalanceBefore = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );

      // Debug: Print all account addresses
      const accounts = {
        admin: provider.wallet.publicKey,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        mint: mint,
        game: newGame1PK,
        gameEscrow: newGameEscrow1PK,
        gameVault: newGameVault1PK,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      const tx = await program.methods
        .resolveGame(entryFeePercentage, 1)
        .accountsPartial(accounts)
        .signers([keypair])
        .remainingAccounts([
          {
            pubkey: newBet1Game1,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: newBet2Game1,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: user1TokenAccount,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: newLine1PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine2PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine3PK,
            isWritable: false,
            isSigner: false,
          },
        ])
        .rpc();

      const gameAccount = await program.account.game.fetch(newGame1PK);
      expect(gameAccount.status).to.deep.equal({ resolved: {} });
      const gameEscrowAccount = await program.account.gameEscrow.fetch(
        newGameEscrow1PK
      );
      expect(gameEscrowAccount.totalAmount.toNumber()).to.equal(0);

      const treasuryBalanceAfter = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );
      expect(
        treasuryBalanceAfter.value.uiAmount! -
          treasuryBalanceBefore.value.uiAmount!
      ).to.equal(
        (entryFeeRaw * (entryFeePercentage / 10000)) / 10 ** MINT_DECIMALS
      );

      const user1BalanceAfter = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      expect(
        user1BalanceAfter.value.uiAmount! - user1BalanceBefore.value.uiAmount!
      ).to.be.closeTo(
        (entryFeeRaw + entryFeeRaw * (1 - entryFeePercentage / 10000)) /
          10 ** MINT_DECIMALS,
        0.000001
      );
      const user2BalanceAfter = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      expect(
        user2BalanceAfter.value.uiAmount! - user2BalanceBefore.value.uiAmount!
      ).to.equal(0);
    });

    it("should successfully resolve game between two users where there is as draw", async () => {
      const user1BalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user2BalanceBefore = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const treasuryBalanceBefore = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );

      // Debug: Print all account addresses
      const accounts = {
        admin: provider.wallet.publicKey,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        mint: mint,
        game: newGame2PK,
        gameEscrow: newGameEscrow2PK,
        gameVault: newGameVault2PK,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      const tx = await program.methods
        .resolveGame(entryFeePercentage, 2)
        .accountsPartial(accounts)
        .signers([keypair])
        .remainingAccounts([
          {
            pubkey: newBet1Game2,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: newBet2Game2,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: user1TokenAccount,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: user2TokenAccount,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: newLine1PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine2PK,
            isWritable: false,
            isSigner: false,
          },
          {
            pubkey: newLine3PK,
            isWritable: false,
            isSigner: false,
          },
        ])
        .rpc();

      const gameAccount = await program.account.game.fetch(newGame1PK);
      expect(gameAccount.status).to.deep.equal({ resolved: {} });
      const gameEscrowAccount = await program.account.gameEscrow.fetch(
        newGameEscrow1PK
      );
      expect(gameEscrowAccount.totalAmount.toNumber()).to.equal(0);

      const treasuryBalanceAfter = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );
      expect(
        treasuryBalanceAfter.value.uiAmount! -
          treasuryBalanceBefore.value.uiAmount!
      ).to.equal(0);

      const user1BalanceAfter = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      expect(
        user1BalanceAfter.value.uiAmount! - user1BalanceBefore.value.uiAmount!
      ).to.equal(entryFeeRaw / 10 ** MINT_DECIMALS);
      const user2BalanceAfter = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      expect(
        user2BalanceAfter.value.uiAmount! - user2BalanceBefore.value.uiAmount!
      ).to.equal(entryFeeRaw / 10 ** MINT_DECIMALS);
    });
  });
});
