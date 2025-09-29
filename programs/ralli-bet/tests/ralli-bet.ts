import * as anchor from "@coral-xyz/anchor";
import { AnchorError, Program } from "@coral-xyz/anchor";
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
import { expect, use } from "chai";

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

let adminKeypair: Keypair;

before(async () => {
  // Load the admin keypair from file
  const adminKeypairPath = path.resolve(__dirname, "../admin-keypair-new.json");
  const secret = Uint8Array.from(
    JSON.parse(fs.readFileSync(adminKeypairPath, "utf-8"))
  );
  adminKeypair = Keypair.fromSecretKey(secret);

  // Airdrop SOL to admin for testing
  const signature = await connection.requestAirdrop(
    adminKeypair.publicKey,
    2 * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature);
});

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
  let user4: Keypair;
  let user5: Keypair;
  let user6: Keypair;
  let user7: Keypair;
  let user8: Keypair;
  let user1TokenAccount: PublicKey;
  let user2TokenAccount: PublicKey;
  let user3TokenAccount: PublicKey;
  let user4TokenAccount: PublicKey;
  let user5TokenAccount: PublicKey;
  let user6TokenAccount: PublicKey;
  let user7TokenAccount: PublicKey;
  let user8TokenAccount: PublicKey;
  let providerTokenAccount: PublicKey;
  let treasuryTokenAccount: PublicKey;
  let users: Keypair[];
  let lineId1: BN = new BN(145);
  let lineId2: BN = new BN(458);
  let lineId3: BN = new BN(790);
  let lineId4: BN = new BN(1012);
  let lineId5: BN = new BN(1014);
  let lineId6: BN = new BN(1015);
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
  let newPredictedValue1 = 17.5;
  let newPredictedValue2 = 0.0;
  let newPredictedValue3 = 60.5;
  let newPredictedValue4 = 101.5;
  let newPredictedValue5 = 10.5;
  let predictedValueError = 0;
  let shouldRefundBettors: boolean;

  let athleteId1: BN = new BN(10001);
  let athleteId2: BN = new BN(10002);
  let athleteId3: BN = new BN(10003);
  let athleteId4: BN = new BN(10004);
  let athleteId5: BN = new BN(10005);
  let athleteId6: BN = new BN(10006);
  let startsAt1: BN = new BN(
    Math.floor((Date.now() + 12000 * 60 * 60 * 24) / 1000)
  );

  let startsAtSoon: BN = new BN(Math.floor((Date.now() + 20000) / 1000));
  let startsAtInvalid: BN = new BN(
    Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000)
  );
  const entryFeeRaw = LAMPORTS_PER_SOL * 0.001;
  const entryFee = new BN(entryFeeRaw); // 0.001 SOL
  const entryFeePercentage = 100;
  const maxUsers = 7;

  before(async () => {
    // Generate test users
    user1 = Keypair.generate();
    user2 = Keypair.generate();
    user3 = Keypair.generate();
    user4 = Keypair.generate();
    user5 = Keypair.generate();
    user6 = Keypair.generate();
    user7 = Keypair.generate();
    user8 = Keypair.generate();
    users = [user1, user2, user3, user4, user5, user6, user7, user8, treasury];

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

    user4TokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        user4,
        mint,
        user4.publicKey
      )
    ).address;

    await mintTo(
      connection,
      keypair,
      mint,
      user4TokenAccount,
      keypair.publicKey,
      MINT_AMOUNT
    );

    user5TokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        user5,
        mint,
        user5.publicKey
      )
    ).address;

    await mintTo(
      connection,
      keypair,
      mint,
      user5TokenAccount,
      keypair.publicKey,
      MINT_AMOUNT
    );

    user6TokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        user6,
        mint,
        user6.publicKey
      )
    ).address;

    await mintTo(
      connection,
      keypair,
      mint,
      user6TokenAccount,
      keypair.publicKey,
      MINT_AMOUNT
    );

    user7TokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection,
        user7,
        mint,
        user7.publicKey
      )
    ).address;

    await mintTo(
      connection,
      keypair,
      mint,
      user7TokenAccount,
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
    it("should create lines successfully", async () => {
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

      // Create line 1
      const tx1 = await program.methods
        .createLine(lineId1, statId1, predictedValue1, athleteId1, startsAt1)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: line1,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Verify line 1 account
      const lineAccount1 = await program.account.line.fetch(line1);
      expect(lineAccount1.statId).to.equal(statId1);
      expect(lineAccount1.predictedValue).to.equal(predictedValue1);
      expect(lineAccount1.athleteId.toString()).to.equal(athleteId1.toString());
      expect(lineAccount1.startsAt.toString()).to.equal(startsAt1.toString());
      expect(lineAccount1.result).to.equal(null);
      expect(lineAccount1.shouldRefundBettors).to.equal(false);
      expect(lineAccount1.actualValue).to.equal(null);

      // Create line 2
      const tx2 = await program.methods
        .createLine(lineId2, statId2, predictedValue2, athleteId2, startsAt1)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: line2,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Create line 3
      const tx3 = await program.methods
        .createLine(lineId3, statId3, predictedValue3, athleteId3, startsAt1)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: line3,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Create line 4
      const tx4 = await program.methods
        .createLine(lineId4, statId4, predictedValue4, athleteId4, startsAt1)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: line4,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Create line 5
      const tx5 = await program.methods
        .createLine(lineId5, statId5, predictedValue5, athleteId5, startsAtSoon)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: line5,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Create line 6
      const tx6 = await program.methods
        .createLine(lineId6, statId6, predictedValue6, athleteId6, startsAtSoon)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: line6,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Set the global line variables
      line1PK = line1;
      line2PK = line2;
      line3PK = line3;
      line4PK = line4;
      line5PK = line5;
      line6PK = line6;
    });

    it("should fail to create line with invalid parameters - not admin", async () => {
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineIdError.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .createLine(
            lineIdError,
            statId1,
            predictedValue1,
            athleteId1,
            startsAt1
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
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineIdError.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .createLine(
            lineIdError,
            statId1,
            predictedValue1,
            athleteId1,
            startsAtInvalid
          )
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: lineError,
            systemProgram: SystemProgram.programId,
          })
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed with InvalidLineStartTime");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: InvalidLineStartTime");
      }
    });

    it("should fail to create line with invalid parameters - invalid predicted value", async () => {
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineIdError.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .createLine(
            lineIdError,
            statId1,
            predictedValueError,
            athleteId1,
            startsAt1
          )
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: lineError,
            systemProgram: SystemProgram.programId,
          })
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed with InvalidPredictedValue");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: InvalidPredictedValue"
        );
      }
    });

    it("should fail to create line with invalid parameters - invalid statId", async () => {
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineIdError.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .createLine(
            lineIdError,
            statIdError,
            predictedValue1,
            athleteId1,
            startsAt1
          )
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: lineError,
            systemProgram: SystemProgram.programId,
          })
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed with InvalidStatId");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: InvalidStatId");
      }
    });

    it("should fail to create duplicate line with same lineId", async () => {
      try {
        const [lineError] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineId1.toArrayLike(Buffer, "le", 8)], // Using existing lineId1
          program.programId
        );

        await program.methods
          .createLine(
            lineId1, // Duplicate line ID
            statId1,
            predictedValue1,
            athleteId1,
            startsAt1
          )
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: lineError,
            systemProgram: SystemProgram.programId,
          })
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed because line already exists");
      } catch (error) {
        // This should fail because the account already exists
        expect(error.toString()).to.include("already in use");
      }
    });
  });

  describe("Update Line Tests", () => {
    it("should update the line successfully", async () => {
      try {
        const [line3] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineId3.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .updateLine(lineId3, newPredictedValue3, shouldRefundBettors)
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: line3,
          })
          .signers([adminKeypair])
          .rpc();

        const updatedLine = await program.account.line.fetch(line3);
        expect(updatedLine.predictedValue.toString()).to.equal(
          newPredictedValue3.toString()
        );
      } catch (error) {
        error;
      }
    });

    it("should fail to update line with invalid parameters - not admin", async () => {
      try {
        const [line1] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineId1.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .updateLine(lineId1, newPredictedValue1, shouldRefundBettors)
          .accountsPartial({
            admin: user1.publicKey,
            line: line1,
          })
          .signers([user1])
          .rpc();

        expect.fail("Should have failed with UnauthorizedLineUpdate");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: UnauthorizedLineUpdate"
        );
      }
    });

    it("should fail to update line if it has already started", async () => {
      const testLineId = new anchor.BN(
        Math.floor(Math.random() * 1000000) + 999999
      );

      const nearFutureTime = Math.floor(Date.now() / 1000) + 2;
      const statId = 1;
      const predictedValue = 25.5;
      const athleteId = new anchor.BN(12345);

      const [linePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), testLineId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      try {
        await program.methods
          .createLine(
            testLineId,
            statId,
            predictedValue,
            athleteId,
            new anchor.BN(nearFutureTime)
          )
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: linePda,
          })
          .signers([adminKeypair])
          .rpc();

        console.log(
          "Line created successfully, now waiting for it to start..."
        );

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const newPredictedValue = 30.0;
        const shouldRefundBettors = false;

        await program.methods
          .updateLine(testLineId, newPredictedValue, shouldRefundBettors)
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: linePda,
          })
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed with LineAlreadyStarted");
      } catch (error) {
        console.log("Caught error:", error.error?.errorCode?.code);

        if (error.error && error.error.errorCode) {
          expect(error.error.errorCode.code).to.equal("LineAlreadyStarted");
        } else {
          expect(error.toString()).to.include("LineAlreadyStarted");
        }
      }
    });

    it("should fail to update line with invalid parameters - invalid predicted value", async () => {
      try {
        const [line2] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineId2.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .updateLine(lineId2, newPredictedValue2, shouldRefundBettors)
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: line2,
          })
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed with InvalidPredictedValue");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: InvalidPredictedValue"
        );
      }
    });

    it("should fail to update line with invalid parameters - same new predicted value as before", async () => {
      try {
        const [line5] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineId5.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .updateLine(lineId5, newPredictedValue5, shouldRefundBettors)
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: line5,
          })
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed with SamePredictedValue");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: SamePredictedValue");
      }
    });

    it("should accept positive path for should_refund_bettors", async () => {
      try {
        const [line4] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineId4.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        await program.methods
          .updateLine(lineId4, newPredictedValue4, true)
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: line4,
          })
          .signers([adminKeypair])
          .rpc();
      } catch (error) {
        error;
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
            admin: adminKeypair.publicKey,
            line: line5PK,
          })
          .signers([adminKeypair])
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
            admin: adminKeypair.publicKey,
            line: line5PK,
          })
          .signers([adminKeypair])
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
          admin: adminKeypair.publicKey,
          line: line5PK,
        })
        .signers([adminKeypair])
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
            admin: adminKeypair.publicKey,
            line: line5PK,
          })
          .signers([adminKeypair])
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
            admin: adminKeypair.publicKey,
            line: line1PK,
          })
          .signers([adminKeypair])
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
          admin: adminKeypair.publicKey,
          line: line6PK,
        })
        .signers([adminKeypair])
        .rpc();

      const resolvedLine = await program.account.line.fetch(line6PK);
      expect(resolvedLine.shouldRefundBettors).to.equal(true);
    });

    it("should allow admin to mark not-started line as refundable", async () => {
      const tx = await program.methods
        .resolveLine({ over: {} }, 19.0, true)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: line1PK,
        })
        .signers([adminKeypair])
        .rpc();

      const resolvedLine = await program.account.line.fetch(line1PK);
      expect(resolvedLine.shouldRefundBettors).to.equal(true);
    });

    it("should prevent admin from resolving line marked as refundable", async () => {
      try {
        const tx = await program.methods
          .resolveLine({ over: {} }, 19.0, false)
          .accountsPartial({
            admin: adminKeypair.publicKey,
            line: line6PK,
          })
          .signers([adminKeypair])
          .rpc();
        expect.fail("Should have failed with LineShouldBeRefunded");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: LineShouldBeRefunded");
      }
    });
  });

  describe("Calculate Correct Tests", () => {
    let calcLine1PK: PublicKey;
    let calcLine2PK: PublicKey;
    let calcLine3PK: PublicKey;
    let calcLineId1: BN;
    let calcLineId2: BN;
    let calcLineId3: BN;

    beforeEach(async () => {
      calcLineId1 = new BN(Math.floor(Math.random() * 1000000) + 2000);
      calcLineId2 = new BN(Math.floor(Math.random() * 1000000) + 3000);
      calcLineId3 = new BN(Math.floor(Math.random() * 1000000) + 4000);

      const startsAtSoon = new BN(Math.floor(Date.now() / 1000) + 3);

      // Derive PDAs for new lines
      [calcLine1PK] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), calcLineId1.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      [calcLine2PK] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), calcLineId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      [calcLine3PK] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), calcLineId3.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      await program.methods
        .createLine(calcLineId1, 1, 17.5, athleteId1, startsAtSoon)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine1PK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await program.methods
        .createLine(calcLineId2, 2, 22.5, athleteId2, startsAtSoon)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine2PK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await program.methods
        .createLine(calcLineId3, 3, 57.5, athleteId3, startsAtSoon)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine3PK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Create a game before each test
      await program.methods
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

      // Join game and submit bets
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

      const [bet1] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .submitBet([
          {
            lineId: calcLine1PK,
            direction: { over: {} },
          },
          {
            lineId: calcLine2PK,
            direction: { under: {} },
          },
          {
            lineId: calcLine3PK,
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
          { pubkey: calcLine1PK, isWritable: false, isSigner: false },
          { pubkey: calcLine2PK, isWritable: false, isSigner: false },
          { pubkey: calcLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      await new Promise((resolve) => setTimeout(resolve, 4000));
    });

    it("should calculate correct count for bet successfully", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );
      // Resolve all lines that the bet depends on
      await program.methods
        .resolveLine({ over: {} }, 19.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine1PK,
        })
        .signers([adminKeypair])
        .rpc();

      await program.methods
        .resolveLine({ under: {} }, 20.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine2PK,
        })
        .signers([adminKeypair])
        .rpc();

      await program.methods
        .resolveLine({ under: {} }, 55.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine3PK,
        })
        .signers([adminKeypair])
        .rpc();
      try {
        // Verify initial state - bet should have 0 correct initially
        const betAccountBefore = await program.account.bet.fetch(bet);
        expect(betAccountBefore.numCorrect).to.equal(0);

        // Calculate correct count
        await program.methods
          .calculateCorrect()
          .accountsPartial({
            admin: adminKeypair.publicKey,
            game: game,
            bet: bet,
          })
          .signers([adminKeypair])
          .remainingAccounts([
            { pubkey: calcLine1PK, isWritable: false, isSigner: false },
            { pubkey: calcLine2PK, isWritable: false, isSigner: false },
            { pubkey: calcLine3PK, isWritable: false, isSigner: false },
          ])
          .rpc();

        // Verify the bet now has correct count calculated
        const betAccountAfter = await program.account.bet.fetch(bet);
        expect(betAccountAfter.numCorrect).to.equal(2); // 2 correct picks out of 3

        // Verify the picks are still intact
        expect(betAccountAfter.picks).to.have.length(3);
        expect(betAccountAfter.picks[0].lineId.toString()).to.equal(
          calcLine1PK.toString()
        );
        expect(betAccountAfter.picks[0].direction).to.deep.equal({ over: {} });
        expect(betAccountAfter.picks[1].lineId.toString()).to.equal(
          calcLine2PK.toString()
        );
        expect(betAccountAfter.picks[1].direction).to.deep.equal({ under: {} });
        expect(betAccountAfter.picks[2].lineId.toString()).to.equal(
          calcLine3PK.toString()
        );
        expect(betAccountAfter.picks[2].direction).to.deep.equal({ over: {} });

        // Verify game is still open
        const gameAccount = await program.account.game.fetch(game);
        expect(gameAccount.status).to.deep.equal({ open: {} });
      } catch (err) {
        throw err;
      }
    });

    it("should fail if non-admin is trying to calculate correct count", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );
      try {
        const tx = await program.methods
          .calculateCorrect()
          .accountsPartial({
            admin: user1.publicKey,
            game: game,
            bet: bet,
          })
          .signers([user1])
          .remainingAccounts([
            { pubkey: calcLine1PK, isWritable: false, isSigner: false },
            { pubkey: calcLine2PK, isWritable: false, isSigner: false },
            { pubkey: calcLine3PK, isWritable: false, isSigner: false },
          ])
          .rpc();
        expect.fail("Should have failed with UnauthorizedCalculation");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: UnauthorizedCalculation"
        );
      }
    });

    it("should fail to calculate correct count if a line is not yet resolved", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .resolveLine({ over: {} }, 19.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine1PK,
        })
        .signers([adminKeypair])
        .rpc();

      await program.methods
        .resolveLine({ under: {} }, 20.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine2PK,
        })
        .signers([adminKeypair])
        .rpc();

      // calcLine3PK is intentionally NOT resolved.

      try {
        await program.methods
          .calculateCorrect()
          .accountsPartial({
            admin: adminKeypair.publicKey,
            game: game,
            bet: bet,
          })
          .signers([adminKeypair])
          .remainingAccounts([
            { pubkey: calcLine1PK, isWritable: false, isSigner: false },
            { pubkey: calcLine2PK, isWritable: false, isSigner: false },
            { pubkey: calcLine3PK, isWritable: false, isSigner: false },
          ])
          .rpc();
        expect.fail("Should have failed with LineNotResolved");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: LineNotResolved");
      }
    });

    it("should fail if a line in remaining_accounts is not in the game's involved lines", async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      const extraLineId = new BN(999999);
      const [extraLinePK] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), extraLineId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const startsAtSoon = new BN(Math.floor(Date.now() / 1000) + 2);

      await program.methods
        .createLine(extraLineId, 1, 10.5, new BN(999), startsAtSoon)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: extraLinePK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for line to start

      await program.methods
        .resolveLine({ over: {} }, 12.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: extraLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      await program.methods
        .resolveLine({ over: {} }, 19.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine1PK,
        })
        .signers([adminKeypair])
        .rpc();

      await program.methods
        .resolveLine({ under: {} }, 20.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: calcLine2PK,
        })
        .signers([adminKeypair])
        .rpc();

      try {
        await program.methods
          .calculateCorrect()
          .accountsPartial({
            admin: adminKeypair.publicKey,
            game: game,
            bet: bet,
          })
          .signers([adminKeypair])
          .remainingAccounts([
            { pubkey: calcLine1PK, isWritable: false, isSigner: false },
            { pubkey: calcLine2PK, isWritable: false, isSigner: false },
            { pubkey: extraLinePK, isWritable: false, isSigner: false }, // Wrong line
          ])
          .rpc();
        expect.fail("Should have failed with LineNotInGame");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: LineNotInGame");
      }
    });

    it("should fail if the bet account does not belong to the game", async () => {
      // Create a second game
      const gameId2 = new BN(Math.floor(Math.random() * 1000000));
      const [game2] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), gameId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [gameEscrow2] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), game2.toBuffer()],
        program.programId
      );
      const gameVault2 = getAssociatedTokenAddressSync(mint, game2, true);

      await program.methods
        .createGame(
          gameId2,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: game2,
          gameEscrow: gameEscrow2,
          gameVault: gameVault2,
          mint: mint,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([user1])
        .rpc();

      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .calculateCorrect()
          .accountsPartial({
            admin: adminKeypair.publicKey,
            game: game2,
            bet: bet,
          })
          .signers([adminKeypair])
          .remainingAccounts([
            { pubkey: calcLine1PK, isWritable: false, isSigner: false },
            { pubkey: calcLine2PK, isWritable: false, isSigner: false },
            { pubkey: calcLine3PK, isWritable: false, isSigner: false },
          ])
          .rpc();
        expect.fail("Should have failed with BetNotInGame");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: ConstraintSeeds");
      }
    });
  });

  describe("Calculate Winners Tests", () => {
    beforeEach(async () => {
      try {
        gameId = new BN(Math.floor(Math.random() * 1000000));
        lineId1 = new BN(Math.floor(Math.random() * 1000000) + 2000);
        lineId2 = new BN(Math.floor(Math.random() * 1000000) + 3000);
        const startsAtSoon = new BN(Math.floor(Date.now() / 1000) + 4);

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
        [line1PK] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineId1.toArrayLike(Buffer, "le", 8)],
          program.programId
        );
        [line2PK] = PublicKey.findProgramAddressSync(
          [Buffer.from("line"), lineId2.toArrayLike(Buffer, "le", 8)],
          program.programId
        );

        // 1. Create Game and Lines
        await program.methods
          .createGame(gameId, 3, entryFee, 2, provider.wallet.publicKey)
          .accountsPartial({
            creator: adminKeypair.publicKey,
            game,
            gameEscrow,
            gameVault,
            mint,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .signers([adminKeypair])
          .rpc();
        await program.methods
          .createLine(lineId1, 1, 10.5, new BN(1), startsAtSoon)
          .accountsPartial({
            line: line1PK,
            admin: adminKeypair.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([adminKeypair])
          .rpc();
        await program.methods
          .createLine(lineId2, 2, 20.5, new BN(2), startsAtSoon)
          .accountsPartial({
            line: line2PK,
            admin: adminKeypair.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([adminKeypair])
          .rpc();

        // 2. Users Join and Submit Bets
        await program.methods
          .joinGame()
          .accountsPartial({
            user: user1.publicKey,
            game,
            gameEscrow,
            gameVault,
            mint,
            userTokens: user1TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();
        await program.methods
          .joinGame()
          .accountsPartial({
            user: user2.publicKey,
            game,
            gameEscrow,
            gameVault,
            mint,
            userTokens: user2TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user2])
          .rpc();
        await program.methods
          .joinGame()
          .accountsPartial({
            user: user3.publicKey,
            game,
            gameEscrow,
            gameVault,
            mint,
            userTokens: user3TokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user3])
          .rpc();

        const [bet1] = PublicKey.findProgramAddressSync(
          [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
          program.programId
        );
        const [bet2] = PublicKey.findProgramAddressSync(
          [Buffer.from("bet"), game.toBuffer(), user2.publicKey.toBuffer()],
          program.programId
        );
        const [bet3] = PublicKey.findProgramAddressSync(
          [Buffer.from("bet"), game.toBuffer(), user3.publicKey.toBuffer()],
          program.programId
        );

        // User 1 (Winner): 2 correct
        await program.methods
          .submitBet([
            { lineId: line1PK, direction: { over: {} } },
            { lineId: line2PK, direction: { over: {} } },
          ])
          .accountsPartial({
            user: user1.publicKey,
            game,
            bet: bet1,
            systemProgram: SystemProgram.programId,
          })
          .remainingAccounts([
            { pubkey: line1PK, isWritable: false, isSigner: false },
            { pubkey: line2PK, isWritable: false, isSigner: false },
          ])
          .signers([user1])
          .rpc();

        // User 2 (Loser): 1 correct
        await program.methods
          .submitBet([
            { lineId: line1PK, direction: { over: {} } },
            { lineId: line2PK, direction: { under: {} } },
          ])
          .accountsPartial({
            user: user2.publicKey,
            game,
            bet: bet2,
            systemProgram: SystemProgram.programId,
          })
          .remainingAccounts([
            { pubkey: line1PK, isWritable: false, isSigner: false },
            { pubkey: line2PK, isWritable: false, isSigner: false },
          ])
          .signers([user2])
          .rpc();

        // User 3 (Winner): 2 correct
        await program.methods
          .submitBet([
            { lineId: line1PK, direction: { over: {} } },
            { lineId: line2PK, direction: { over: {} } },
          ])
          .accountsPartial({
            user: user3.publicKey,
            game,
            bet: bet3,
            systemProgram: SystemProgram.programId,
          })
          .remainingAccounts([
            { pubkey: line1PK, isWritable: false, isSigner: false },
            { pubkey: line2PK, isWritable: false, isSigner: false },
          ])
          .signers([user3])
          .rpc();

        const bet1Account = await program.account.bet.fetch(bet1);
        const bet2Account = await program.account.bet.fetch(bet2);
        const bet3Account = await program.account.bet.fetch(bet3);

        // 3. Resolve Lines and Grade Each Bet
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await program.methods
          .resolveLine({ over: {} }, 11.0, false)
          .accountsPartial({ admin: adminKeypair.publicKey, line: line1PK })
          .signers([adminKeypair])
          .rpc();
        await program.methods
          .resolveLine({ over: {} }, 21.0, false)
          .accountsPartial({ admin: adminKeypair.publicKey, line: line2PK })
          .signers([adminKeypair])
          .rpc();

        // Call calculateCorrect for EVERY bet to prepare the game state
        await program.methods
          .calculateCorrect()
          .accountsPartial({ admin: adminKeypair.publicKey, game, bet: bet1 })
          .remainingAccounts([
            { pubkey: line1PK, isWritable: false, isSigner: false },
            { pubkey: line2PK, isWritable: false, isSigner: false },
          ])
          .signers([adminKeypair])
          .rpc();

        await program.methods
          .calculateCorrect()
          .accountsPartial({ admin: adminKeypair.publicKey, game, bet: bet2 })
          .remainingAccounts([
            { pubkey: line1PK, isWritable: false, isSigner: false },
            { pubkey: line2PK, isWritable: false, isSigner: false },
          ])
          .signers([adminKeypair])
          .rpc();

        await program.methods
          .calculateCorrect()
          .accountsPartial({ admin: adminKeypair.publicKey, game, bet: bet3 })
          .remainingAccounts([
            { pubkey: line1PK, isWritable: false, isSigner: false },
            { pubkey: line2PK, isWritable: false, isSigner: false },
          ])
          .signers([adminKeypair])
          .rpc();

        const bet1AfterCalc = await program.account.bet.fetch(bet1);
        const bet2AfterCalc = await program.account.bet.fetch(bet2);
        const bet3AfterCalc = await program.account.bet.fetch(bet3);

        global.testBet1 = bet1;
        global.testBet2 = bet2;
        global.testBet3 = bet3;
      } catch (err) {
        if (err instanceof anchor.AnchorError) {
          console.log("AnchorError:", err.error.errorMessage);
          console.log("Error Code:", err.error.errorCode.number);
          console.log("Origin:", err.error.origin);
        } else {
          console.error("Unknown error:", err);
        }
        throw err;
      }
    });

    it("should successfully calculate winners and update game state", async () => {
      const gameAccountBefore = await program.account.game.fetch(game);
      expect(gameAccountBefore.numWinners).to.equal(0);
      expect(gameAccountBefore.calculationComplete).to.be.false;

      const bet1 = global.testBet1;
      const bet2 = global.testBet2;
      const bet3 = global.testBet3;

      try {
        await program.account.bet.fetch(bet1);
        await program.account.bet.fetch(bet2);
        await program.account.bet.fetch(bet3);
      } catch (err) {
        console.error("Bet account verification failed:", err);
        throw err;
      }

      await program.methods
        .calculateWinners()
        .accountsPartial({
          game: game,
          admin: adminKeypair.publicKey,
        })
        .remainingAccounts([
          { pubkey: bet1, isWritable: false, isSigner: false },
          { pubkey: bet2, isWritable: false, isSigner: false },
          { pubkey: bet3, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      const gameAccountAfter = await program.account.game.fetch(game);
      expect(gameAccountAfter.numWinners).to.equal(2);
      expect(gameAccountAfter.correctVotesToBeWinner).to.equal(2);
      expect(gameAccountAfter.calculationComplete).to.be.true;
    });

    it("should fail if non-admin is trying to calculate winners", async () => {
      try {
        const tx = await program.methods
          .calculateWinners()
          .accountsPartial({
            admin: user1.publicKey,
            game: game,
          })
          .signers([user1])
          .remainingAccounts([
            { pubkey: line1PK, isWritable: false, isSigner: false },
            { pubkey: line2PK, isWritable: false, isSigner: false },
            { pubkey: line3PK, isWritable: false, isSigner: false },
          ])
          .rpc();
        expect.fail("Should have failed with UnauthorizedGameFinalization");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: UnauthorizedGameFinalization"
        );
      }
    });

    it("should fail if calculation is already complete", async () => {
      const [bet1] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );
      const [bet2] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user2.publicKey.toBuffer()],
        program.programId
      );
      const [bet3] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user3.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .calculateWinners()
        .accountsPartial({ game })
        .remainingAccounts([
          { pubkey: bet1, isWritable: false, isSigner: false },
          { pubkey: bet2, isWritable: false, isSigner: false },
          { pubkey: bet3, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      try {
        await program.methods
          .calculateWinners()
          .accountsPartial({ game })
          .remainingAccounts([
            { pubkey: bet1, isWritable: false, isSigner: false },
            { pubkey: bet2, isWritable: false, isSigner: false },
            { pubkey: bet3, isWritable: false, isSigner: false },
          ])
          .signers([adminKeypair])
          .rpc();
        expect.fail("Should have failed with CalculationAlreadyComplete");
      } catch (error) {
        expect(error.toString()).to.include(
          "Error Code: CalculationAlreadyComplete"
        );
      }
    });

    it("should fail if no bet accounts are provided", async () => {
      try {
        await program.methods
          .calculateWinners()
          .accountsPartial({
            game,
          })
          .remainingAccounts([])
          .signers([adminKeypair])
          .rpc();
        expect.fail("Should have failed with NoBetsInGame");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: NoBetsInGame");
      }
    });

    it("should fail if a bet account from another game is passed", async () => {
      const gameId2 = new BN(Math.floor(Math.random() * 1000000));
      const [game2] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), gameId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [gameEscrow2] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), game2.toBuffer()],
        program.programId
      );
      const gameVault2 = getAssociatedTokenAddressSync(mint, game2, true);

      const newLineId1 = new BN(Math.floor(Math.random() * 1000000) + 5000);
      const newLineId2 = new BN(Math.floor(Math.random() * 1000000) + 6000);
      const [newLine1PK] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), newLineId1.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [newLine2PK] = PublicKey.findProgramAddressSync(
        [Buffer.from("line"), newLineId2.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const newStartsAt = new BN(Math.floor(Date.now() / 1000) + 10);

      await program.methods
        .createLine(newLineId1, 1, 5.5, new BN(5), newStartsAt)
        .accountsPartial({
          line: newLine1PK,
          admin: adminKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();
      await program.methods
        .createLine(newLineId2, 2, 15.5, new BN(6), newStartsAt)
        .accountsPartial({
          line: newLine2PK,
          admin: adminKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await program.methods
        .createGame(gameId2, 2, entryFee, 2, provider.wallet.publicKey)
        .accountsPartial({
          creator: user4.publicKey,
          game: game2,
          gameEscrow: gameEscrow2,
          gameVault: gameVault2,
          mint: mint,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([user4])
        .rpc();

      await program.methods
        .joinGame()
        .accountsPartial({
          user: user4.publicKey,
          game: game2,
          gameEscrow: gameEscrow2,
          gameVault: gameVault2,
          mint: mint,
          userTokens: user4TokenAccount,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([user4])
        .rpc();

      const [betFromGame2] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game2.toBuffer(), user4.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .submitBet([
          { lineId: newLine1PK, direction: { over: {} } },
          { lineId: newLine2PK, direction: { over: {} } },
        ])
        .accountsPartial({
          user: user4.publicKey,
          game: game2,
          bet: betFromGame2,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
        ])
        .signers([user4])
        .rpc();

      const [bet1] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );
      const [bet2] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), user2.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .calculateWinners()
          .accountsPartial({ game: game })
          .remainingAccounts([
            { pubkey: bet1, isWritable: false, isSigner: false },
            { pubkey: bet2, isWritable: false, isSigner: false },
            { pubkey: betFromGame2, isWritable: false, isSigner: false },
          ])
          .signers([adminKeypair])
          .rpc();
        expect.fail("Should have failed with BetNotInGame");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: BetNotInGame");
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

    let newGame7PK: PublicKey;
    let newGame8PK: PublicKey;
    let newGame9PK: PublicKey;
    let newGame10PK: PublicKey;
    let newGame11PK: PublicKey;
    let newGame12PK: PublicKey;
    let newGame13PK: PublicKey;
    let newGame14PK: PublicKey;

    let newGameEscrow1PK: PublicKey;
    let newGameEscrow2PK: PublicKey;
    let newGameEscrow3PK: PublicKey;
    let newGameEscrow4PK: PublicKey;
    let newGameEscrow5PK: PublicKey;
    let newGameEscrow6PK: PublicKey;

    ////NEW LINES

    let newGameEscrow7PK: PublicKey;
    let newGameEscrow8PK: PublicKey;
    let newGameEscrow9PK: PublicKey;
    let newGameEscrow10PK: PublicKey;
    let newGameEscrow11PK: PublicKey;
    let newGameEscrow12PK: PublicKey;
    let newGameEscrow13PK: PublicKey;
    let newGameEscrow14PK: PublicKey;

    ////LINE ENDS

    let newGameVault1PK: PublicKey;
    let newGameVault2PK: PublicKey;
    let newGameVault3PK: PublicKey;
    let newGameVault4PK: PublicKey;
    let newGameVault5PK: PublicKey;
    let newGameVault6PK: PublicKey;

    ////NEW LINES

    let newGameVault7PK: PublicKey;
    let newGameVault8PK: PublicKey;
    let newGameVault9PK: PublicKey;
    let newGameVault10PK: PublicKey;
    let newGameVault11PK: PublicKey;
    let newGameVault12PK: PublicKey;
    let newGameVault13PK: PublicKey;
    let newGameVault14PK: PublicKey;

    ////LINE ENDS

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

    let newBet1Game3: PublicKey;
    let newBet2Game3: PublicKey;
    let newBet3Game3: PublicKey;
    let newBet4Game3: PublicKey;

    let newBet1Game4: PublicKey;
    let newBet2Game4: PublicKey;
    let newBet3Game4: PublicKey;
    let newBet4Game4: PublicKey;

    ////NEW LINES

    let newBet1Game7: PublicKey;
    let newBet2Game7: PublicKey;
    let newBet3Game7: PublicKey;
    let newBet4Game7: PublicKey;
    let newBet5Game7: PublicKey;
    let newBet6Game7: PublicKey;
    let newBet7Game7: PublicKey;

    let newBet1Game8: PublicKey;
    let newBet2Game8: PublicKey;
    let newBet3Game8: PublicKey;
    let newBet4Game8: PublicKey;
    let newBet5Game8: PublicKey;

    let newBet1Game9: PublicKey;
    let newBet2Game9: PublicKey;
    let newBet3Game9: PublicKey;
    let newBet4Game9: PublicKey;
    let newBet5Game9: PublicKey;
    let newBet6Game9: PublicKey;

    let newBet1Game10: PublicKey;
    let newBet2Game10: PublicKey;
    let newBet3Game10: PublicKey;

    let newBet1Game11: PublicKey;
    let newBet2Game11: PublicKey;
    let newBet3Game11: PublicKey;
    let newBet4Game11: PublicKey;
    let newBet5Game11: PublicKey;

    let newBet1Game12: PublicKey;
    let newBet2Game12: PublicKey;
    let newBet3Game12: PublicKey;
    let newBet4Game12: PublicKey;

    let newBet1Game13: PublicKey;
    let newBet2Game13: PublicKey;
    let newBet3Game13: PublicKey;
    let newBet4Game13: PublicKey;

    let newBet1Game14: PublicKey;

    ////LINE ENDS

    before(async () => {
      let newStartsSoonRaw = Date.now() + 30000;
      let newStartsSoon = new BN(Math.floor(newStartsSoonRaw / 1000));

      let newStartsSoonRawNew = Date.now() + 60000; // 1 minute instead of 30 seconds
      let newStartsSoonNew = new BN(Math.floor(newStartsSoonRawNew / 1000));

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
          admin: adminKeypair.publicKey,
          line: newLine1,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
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
          admin: adminKeypair.publicKey,
          line: newLine2,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
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
          admin: adminKeypair.publicKey,
          line: newLine3,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
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
          admin: adminKeypair.publicKey,
          line: newLine4,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
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
          admin: adminKeypair.publicKey,
          line: newLine5,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
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
          admin: adminKeypair.publicKey,
          line: newLine6,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
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

      const newGameId3 = new BN(2003);

      const [newGame3] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), newGameId3.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newGameEscrow3] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), newGame3.toBuffer()],
        program.programId
      );

      const newGameVault3 = getAssociatedTokenAddressSync(mint, newGame3, true);

      const txCreateGame3 = await program.methods
        .createGame(
          newGameId3,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: newGame3,
          gameEscrow: newGameEscrow3,
          gameVault: newGameVault3,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      const txJoinGame3User1 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: newGame3,
          gameEscrow: newGameEscrow3,
          gameVault: newGameVault3,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      [newBet1Game3] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame3.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet1Game3 = await program.methods
        .submitBet([
          {
            lineId: newLine1PK,
            direction: { over: {} },
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
          user: user1.publicKey,
          game: newGame3,
          bet: newBet1Game3,
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

      const txJoinGame3User2 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user2.publicKey,
          game: newGame3,
          gameEscrow: newGameEscrow3,
          gameVault: newGameVault3,
          mint: mint,
          userTokens: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();

      [newBet2Game3] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame3.toBuffer(), user2.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet2Game3 = await program.methods
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
          game: newGame3,
          bet: newBet2Game3,
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

      const txJoinGame3User3 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user3.publicKey,
          game: newGame3,
          gameEscrow: newGameEscrow3,
          gameVault: newGameVault3,
          mint: mint,
          userTokens: user3TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user3])
        .rpc();

      [newBet3Game3] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame3.toBuffer(), user3.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet3Game3 = await program.methods
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
          user: user3.publicKey,
          game: newGame3,
          bet: newBet3Game3,
        })
        .signers([user3])
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

      const txJoinGame3User4 = await program.methods
        .joinGame()
        .accountsPartial({
          user: keypair.publicKey,
          game: newGame3,
          gameEscrow: newGameEscrow3,
          gameVault: newGameVault3,
          mint: mint,
          userTokens: providerTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      [newBet4Game3] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame3.toBuffer(), keypair.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet4Game3 = await program.methods
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
          user: keypair.publicKey,
          game: newGame3,
          bet: newBet4Game3,
        })
        .signers([keypair])
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

      newGame3PK = newGame3;
      newGameEscrow3PK = newGameEscrow3;
      newGameVault3PK = newGameVault3;

      const newGameId4 = new BN(2004);

      const [newGame4] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), newGameId4.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newGameEscrow4] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), newGame4.toBuffer()],
        program.programId
      );

      const newGameVault4 = getAssociatedTokenAddressSync(mint, newGame4, true);

      const txCreateGame4 = await program.methods
        .createGame(
          newGameId4,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: newGame4,
          gameEscrow: newGameEscrow4,
          gameVault: newGameVault4,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      const txJoinGame4User1 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: newGame4,
          gameEscrow: newGameEscrow4,
          gameVault: newGameVault4,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      [newBet1Game4] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame4.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet1Game4 = await program.methods
        .submitBet([
          {
            lineId: newLine1PK,
            direction: { over: {} },
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
          user: user1.publicKey,
          game: newGame4,
          bet: newBet1Game4,
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

      const txJoinGame4User2 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user2.publicKey,
          game: newGame4,
          gameEscrow: newGameEscrow4,
          gameVault: newGameVault4,
          mint: mint,
          userTokens: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();

      [newBet2Game4] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame4.toBuffer(), user2.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet2Game4 = await program.methods
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
          game: newGame4,
          bet: newBet2Game4,
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

      const txJoinGame4User3 = await program.methods
        .joinGame()
        .accountsPartial({
          user: user3.publicKey,
          game: newGame4,
          gameEscrow: newGameEscrow4,
          gameVault: newGameVault4,
          mint: mint,
          userTokens: user3TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user3])
        .rpc();

      [newBet3Game4] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame4.toBuffer(), user3.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet3Game4 = await program.methods
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
          user: user3.publicKey,
          game: newGame4,
          bet: newBet3Game4,
        })
        .signers([user3])
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

      const txJoinGame4User4 = await program.methods
        .joinGame()
        .accountsPartial({
          user: keypair.publicKey,
          game: newGame4,
          gameEscrow: newGameEscrow4,
          gameVault: newGameVault4,
          mint: mint,
          userTokens: providerTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

      [newBet4Game4] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame4.toBuffer(), keypair.publicKey.toBuffer()],
        program.programId
      );

      const txSubmitBet4Game4 = await program.methods
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
          user: keypair.publicKey,
          game: newGame4,
          bet: newBet4Game4,
        })
        .signers([keypair])
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

      newGame4PK = newGame4;
      newGameEscrow4PK = newGameEscrow4;
      newGameVault4PK = newGameVault4;

      const newGameId5 = new BN(2005);

      const [newGame5] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), newGameId5.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [newGameEscrow5] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), newGame5.toBuffer()],
        program.programId
      );

      const newGameVault5 = getAssociatedTokenAddressSync(mint, newGame5, true);

      const txCreateGame5 = await program.methods
        .createGame(
          newGameId5,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: newGame5,
          gameEscrow: newGameEscrow5,
          gameVault: newGameVault5,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      newGame5PK = newGame5;
      newGameEscrow5PK = newGameEscrow5;
      newGameVault5PK = newGameVault5;

      ////NEW LINE

      // GAME 7: 7 users, 2 winners with high fees
      const newGameId7 = new BN(2007);
      const [newGame7] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), newGameId7.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [newGameEscrow7] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), newGame7.toBuffer()],
        program.programId
      );
      const newGameVault7 = getAssociatedTokenAddressSync(mint, newGame7, true);

      const txCreateGame7 = await program.methods
        .createGame(
          newGameId7,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: newGame7,
          gameEscrow: newGameEscrow7,
          gameVault: newGameVault7,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // Add 7 users to game 7 with different betting strategies
      const users = [user1, user2, user3, user4, user5, user6, keypair]; // Reuse users for 7 total
      const userTokenAccounts = [
        user1TokenAccount,
        user2TokenAccount,
        user3TokenAccount,
        user4TokenAccount,
        user5TokenAccount,
        user6TokenAccount,
        providerTokenAccount,
      ];

      for (let i = 0; i < 7; i++) {
        await program.methods
          .joinGame()
          .accountsPartial({
            user: users[i].publicKey,
            game: newGame7,
            gameEscrow: newGameEscrow7,
            gameVault: newGameVault7,
            mint: mint,
            userTokens: userTokenAccounts[i],
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([users[i]])
          .rpc();

        const betPK = PublicKey.findProgramAddressSync(
          [
            Buffer.from("bet"),
            newGame7.toBuffer(),
            users[i].publicKey.toBuffer(),
          ],
          program.programId
        )[0];

        // Submit bet directly inline like in working examples
        if (i < 2) {
          // Winners pattern
          await program.methods
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
              user: users[i].publicKey,
              game: newGame7,
              bet: betPK,
            })
            .signers([users[i]])
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
        } else {
          // Losers pattern
          await program.methods
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
              user: users[i].publicKey,
              game: newGame7,
              bet: betPK,
            })
            .signers([users[i]])
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
        }

        // Store bet references
        if (i === 0) newBet1Game7 = betPK;
        else if (i === 1) newBet2Game7 = betPK;
        else if (i === 2) newBet3Game7 = betPK;
        else if (i === 3) newBet4Game7 = betPK;
        else if (i === 4) newBet5Game7 = betPK;
        else if (i === 5) newBet6Game7 = betPK;
        else if (i === 6) newBet7Game7 = betPK;
      }

      newGame7PK = newGame7;
      newGameEscrow7PK = newGameEscrow7;
      newGameVault7PK = newGameVault7;

      // GAME 8: 5 users, 4 winners with medium fees
      const newGameId8 = new BN(2008);
      const [newGame8] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), newGameId8.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [newGameEscrow8] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), newGame8.toBuffer()],
        program.programId
      );
      const newGameVault8 = getAssociatedTokenAddressSync(mint, newGame8, true);

      await program.methods
        .createGame(
          newGameId8,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: newGame8,
          gameEscrow: newGameEscrow8,
          gameVault: newGameVault8,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // Add 5 users, 4 will win
      const users8 = [user1, user2, keypair, user4, user3];
      const userTokenAccounts8 = [
        user1TokenAccount,
        user2TokenAccount,
        providerTokenAccount,
        user4TokenAccount,
        user3TokenAccount,
      ];

      for (let i = 0; i < 5; i++) {
        await program.methods
          .joinGame()
          .accountsPartial({
            user: users8[i].publicKey,
            game: newGame8,
            gameEscrow: newGameEscrow8,
            gameVault: newGameVault8,
            mint: mint,
            userTokens: userTokenAccounts8[i],
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([users8[i]])
          .rpc();

        const betPK = PublicKey.findProgramAddressSync(
          [
            Buffer.from("bet"),
            newGame8.toBuffer(),
            users8[i].publicKey.toBuffer(),
          ],
          program.programId
        )[0];

        // Only user at index 4 will lose
        if (i === 4) {
          // Loser pattern
          await program.methods
            .submitBet([
              { lineId: newLine1PK, direction: { under: {} } },
              { lineId: newLine2PK, direction: { over: {} } },
              { lineId: newLine3PK, direction: { under: {} } },
            ])
            .accountsPartial({
              user: users8[i].publicKey,
              game: newGame8,
              bet: betPK,
            })
            .signers([users8[i]])
            .remainingAccounts([
              { pubkey: newLine1PK, isWritable: false, isSigner: false },
              { pubkey: newLine2PK, isWritable: false, isSigner: false },
              { pubkey: newLine3PK, isWritable: false, isSigner: false },
            ])
            .rpc();
        } else {
          // Winner pattern
          await program.methods
            .submitBet([
              { lineId: newLine1PK, direction: { over: {} } },
              { lineId: newLine2PK, direction: { under: {} } },
              { lineId: newLine3PK, direction: { over: {} } },
            ])
            .accountsPartial({
              user: users8[i].publicKey,
              game: newGame8,
              bet: betPK,
            })
            .signers([users8[i]])
            .remainingAccounts([
              { pubkey: newLine1PK, isWritable: false, isSigner: false },
              { pubkey: newLine2PK, isWritable: false, isSigner: false },
              { pubkey: newLine3PK, isWritable: false, isSigner: false },
            ])
            .rpc();
        }

        if (i === 0) newBet1Game8 = betPK;
        else if (i === 1) newBet2Game8 = betPK;
        else if (i === 2) newBet3Game8 = betPK;
        else if (i === 3) newBet4Game8 = betPK;
        else if (i === 4) newBet5Game8 = betPK;
      }

      newGame8PK = newGame8;
      newGameEscrow8PK = newGameEscrow8;
      newGameVault8PK = newGameVault8;

      // Single user game (edge case)
      const newGameId14 = new BN(2014);
      const [newGame14] = PublicKey.findProgramAddressSync(
        [Buffer.from("game"), newGameId14.toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [newGameEscrow14] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), newGame14.toBuffer()],
        program.programId
      );
      const newGameVault14 = getAssociatedTokenAddressSync(
        mint,
        newGame14,
        true
      );

      await program.methods
        .createGame(
          newGameId14,
          maxUsers,
          entryFee,
          numberOfLines,
          provider.wallet.publicKey
        )
        .accountsPartial({
          creator: user1.publicKey,
          game: newGame14,
          gameEscrow: newGameEscrow14,
          gameVault: newGameVault14,
          mint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // Add only 1 user
      await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: newGame14,
          gameEscrow: newGameEscrow14,
          gameVault: newGameVault14,
          mint: mint,
          userTokens: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      newBet1Game14 = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), newGame14.toBuffer(), user1.publicKey.toBuffer()],
        program.programId
      )[0];

      await program.methods
        .submitBet([
          { lineId: newLine1PK, direction: { over: {} } },
          { lineId: newLine2PK, direction: { under: {} } },
          { lineId: newLine3PK, direction: { over: {} } },
        ])
        .accountsPartial({
          user: user1.publicKey,
          game: newGame14,
          bet: newBet1Game14,
        })
        .signers([user1])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      newGame14PK = newGame14;
      newGameEscrow14PK = newGameEscrow14;
      newGameVault14PK = newGameVault14;

      ////LINE ENDS

      const timeToWait = newStartsSoonRaw - Date.now();

      await new Promise((resolve) => setTimeout(resolve, timeToWait + 2000));

      const txResolveNewLine1 = await program.methods
        .resolveLine({ over: {} }, 19.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: newLine1PK,
        })
        .signers([adminKeypair])
        .rpc();

      const txResolveNewLine2 = await program.methods
        .resolveLine({ under: {} }, 10.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: newLine2PK,
        })
        .signers([adminKeypair])
        .rpc();

      const txResolveNewLine3 = await program.methods
        .resolveLine({ over: {} }, 60.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: newLine3PK,
        })
        .signers([adminKeypair])
        .rpc();

      const txResolveNewLine4 = await program.methods
        .resolveLine({ under: {} }, 19.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: newLine4PK,
        })
        .signers([adminKeypair])
        .rpc();

      const txResolveNewLine5 = await program.methods
        .resolveLine({ over: {} }, 19.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: newLine5PK,
        })
        .signers([adminKeypair])
        .rpc();

      const txResolveNewLine6 = await program.methods
        .resolveLine({ under: {} }, 9.0, false)
        .accountsPartial({
          admin: adminKeypair.publicKey,
          line: newLine6PK,
        })
        .signers([adminKeypair])
        .rpc();

      // Game 1 - 2 calculate_correct calls
      const txCalculateCorrect1Game1 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame1PK,
          bet: newBet1Game1,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect2Game1 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame1PK,
          bet: newBet2Game1,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      // Game 2 - 2 calculate_correct calls
      const txCalculateCorrect1Game2 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame2PK,
          bet: newBet1Game2,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect2Game2 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame2PK,
          bet: newBet2Game2,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      // Game 3 - 4 calculate_correct calls
      const txCalculateCorrect1Game3 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame3PK,
          bet: newBet1Game3,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect2Game3 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame3PK,
          bet: newBet2Game3,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect3Game3 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame3PK,
          bet: newBet3Game3,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect4Game3 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame3PK,
          bet: newBet4Game3,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      // Game 4 - 4 calculate_correct calls
      const txCalculateCorrect1Game4 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame4PK,
          bet: newBet1Game4,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect2Game4 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame4PK,
          bet: newBet2Game4,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect3Game4 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame4PK,
          bet: newBet3Game4,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect4Game4 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame4PK,
          bet: newBet4Game4,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      // Game 7 - 7 calculate_correct calls
      const txCalculateCorrect1Game7 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame7PK,
          bet: newBet1Game7,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect2Game7 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame7PK,
          bet: newBet2Game7,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect3Game7 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame7PK,
          bet: newBet3Game7,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect4Game7 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame7PK,
          bet: newBet4Game7,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect5Game7 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame7PK,
          bet: newBet5Game7,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect6Game7 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame7PK,
          bet: newBet6Game7,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect7Game7 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame7PK,
          bet: newBet7Game7,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      // Game 8 - 5 calculate_correct calls
      const txCalculateCorrect1Game8 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame8PK,
          bet: newBet1Game8,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect2Game8 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame8PK,
          bet: newBet2Game8,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect3Game8 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame8PK,
          bet: newBet3Game8,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect4Game8 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame8PK,
          bet: newBet4Game8,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      const txCalculateCorrect5Game8 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame8PK,
          bet: newBet5Game8,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      // Game 14 - 1 calculate_correct call (you already have this one)
      const txCalculateCorrect1Game14 = await program.methods
        .calculateCorrect()
        .accountsPartial({
          admin: adminKeypair.publicKey,
          game: newGame14PK,
          bet: newBet1Game14,
        })
        .signers([adminKeypair])
        .remainingAccounts([
          { pubkey: newLine1PK, isWritable: false, isSigner: false },
          { pubkey: newLine2PK, isWritable: false, isSigner: false },
          { pubkey: newLine3PK, isWritable: false, isSigner: false },
        ])
        .rpc();

      // Game 1 - calculate_winners call
      const txCalculateWinnersGame1 = await program.methods
        .calculateWinners()
        .accountsPartial({
          game: newGame1PK,
          admin: adminKeypair.publicKey,
        })
        .remainingAccounts([
          { pubkey: newBet1Game1, isWritable: false, isSigner: false },
          { pubkey: newBet2Game1, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      // Game 2 - calculate_winners call
      const txCalculateWinnersGame2 = await program.methods
        .calculateWinners()
        .accountsPartial({
          game: newGame2PK,
          admin: adminKeypair.publicKey,
        })
        .remainingAccounts([
          { pubkey: newBet1Game2, isWritable: false, isSigner: false },
          { pubkey: newBet2Game2, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      // Game 3 - calculate_winners call
      const txCalculateWinnersGame3 = await program.methods
        .calculateWinners()
        .accountsPartial({
          game: newGame3PK,
          admin: adminKeypair.publicKey,
        })
        .remainingAccounts([
          { pubkey: newBet1Game3, isWritable: false, isSigner: false },
          { pubkey: newBet2Game3, isWritable: false, isSigner: false },
          { pubkey: newBet3Game3, isWritable: false, isSigner: false },
          { pubkey: newBet4Game3, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      // Game 4 - calculate_winners call
      const txCalculateWinnersGame4 = await program.methods
        .calculateWinners()
        .accountsPartial({
          game: newGame4PK,
          admin: adminKeypair.publicKey,
        })
        .remainingAccounts([
          { pubkey: newBet1Game4, isWritable: false, isSigner: false },
          { pubkey: newBet2Game4, isWritable: false, isSigner: false },
          { pubkey: newBet3Game4, isWritable: false, isSigner: false },
          { pubkey: newBet4Game4, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      // Game 7 - calculate_winners call
      const txCalculateWinnersGame7 = await program.methods
        .calculateWinners()
        .accountsPartial({
          game: newGame7PK,
          admin: adminKeypair.publicKey,
        })
        .remainingAccounts([
          { pubkey: newBet1Game7, isWritable: false, isSigner: false },
          { pubkey: newBet2Game7, isWritable: false, isSigner: false },
          { pubkey: newBet3Game7, isWritable: false, isSigner: false },
          { pubkey: newBet4Game7, isWritable: false, isSigner: false },
          { pubkey: newBet5Game7, isWritable: false, isSigner: false },
          { pubkey: newBet6Game7, isWritable: false, isSigner: false },
          { pubkey: newBet7Game7, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      // Game 8 - calculate_winners call
      const txCalculateWinnersGame8 = await program.methods
        .calculateWinners()
        .accountsPartial({
          game: newGame8PK,
          admin: adminKeypair.publicKey,
        })
        .remainingAccounts([
          { pubkey: newBet1Game8, isWritable: false, isSigner: false },
          { pubkey: newBet2Game8, isWritable: false, isSigner: false },
          { pubkey: newBet3Game8, isWritable: false, isSigner: false },
          { pubkey: newBet4Game8, isWritable: false, isSigner: false },
          { pubkey: newBet5Game8, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      // Game 14 - calculate_winners call (you already have this one)
      const txCalculateWinnersGame14 = await program.methods
        .calculateWinners()
        .accountsPartial({
          game: newGame14PK,
          admin: adminKeypair.publicKey,
        })
        .remainingAccounts([
          { pubkey: newBet1Game14, isWritable: false, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();
    });

    it("should successfully resolve a 2-player game where one player wins", async () => {
      const user1BalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user2BalanceBefore = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const treasuryBalanceBefore = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );
      const gameVaultBalanceBefore = await connection.getTokenAccountBalance(
        newGameVault1PK
      );

      expect(gameVaultBalanceBefore.value.uiAmount).to.equal(
        (entryFeeRaw * 2) / 10 ** MINT_DECIMALS
      );

      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame1PK,
        gameEscrow: newGameEscrow1PK,
        mint: mint,
        gameVault: newGameVault1PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      await program.methods
        .resolveGame(entryFeePercentage)
        .accounts(accounts)
        .remainingAccounts([
          {
            pubkey: user1TokenAccount,
            isWritable: true,
            isSigner: false,
          },
        ])
        .signers([adminKeypair])
        .rpc();

      const gameAccount = await program.account.game.fetch(newGame1PK);
      const gameEscrowAccount = await program.account.gameEscrow.fetch(
        newGameEscrow1PK
      );

      expect(gameAccount.status).to.deep.equal({ resolved: {} });
      expect(gameEscrowAccount.totalAmount.toNumber()).to.equal(0);

      const gameVaultBalanceAfter = await connection.getTokenAccountBalance(
        newGameVault1PK
      );
      expect(gameVaultBalanceAfter.value.uiAmount).to.equal(0);

      // Check treasury balance
      const treasuryBalanceAfter = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );
      const feeCollected =
        (entryFeeRaw * (entryFeePercentage / 10000)) / 10 ** MINT_DECIMALS;
      expect(
        treasuryBalanceAfter.value.uiAmount! -
          treasuryBalanceBefore.value.uiAmount!
      ).to.be.closeTo(feeCollected, 0.000001);

      // Check winner's balance (user1)
      const user1BalanceAfter = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const feeAmount = (entryFeeRaw * entryFeePercentage) / 10000;
      const totalPayoutToWinner =
        (entryFeeRaw + (entryFeeRaw - feeAmount)) / 10 ** MINT_DECIMALS;

      expect(
        user1BalanceAfter.value.uiAmount! - user1BalanceBefore.value.uiAmount!
      ).to.be.closeTo(totalPayoutToWinner, 0.000001);
    });

    it("should fail to resolve a game that is already resolved", async () => {
      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame1PK,
        gameEscrow: newGameEscrow1PK,
        mint: mint,
        gameVault: newGameVault1PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      await program.methods
        .resolveGame(entryFeePercentage)
        .accounts(accounts)
        .remainingAccounts([
          {
            pubkey: user1TokenAccount,
            isWritable: true,
            isSigner: false,
          },
        ])
        .signers([adminKeypair])
        .rpc();

      try {
        await program.methods
          .resolveGame(entryFeePercentage)
          .accounts(accounts)
          .remainingAccounts([
            {
              pubkey: user1TokenAccount,
              isWritable: true,
              isSigner: false,
            },
          ])
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed with GameAlreadyResolved error");
      } catch (error) {
        expect(error.toString()).to.include("Error Code: GameAlreadyResolved");
      }
    });

    it("should successfully resolve a game between two users where there is a draw", async () => {
      const user1BalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user2BalanceBefore = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const treasuryBalanceBefore = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );

      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame2PK,
        gameEscrow: newGameEscrow2PK,
        mint: mint,
        gameVault: newGameVault2PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      await program.methods
        .resolveGame(entryFeePercentage)
        .accounts(accounts)
        .remainingAccounts([
          // FIX: Provide ONLY the winner token accounts
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
        ])
        .signers([adminKeypair])
        .rpc();

      const gameAccount = await program.account.game.fetch(newGame2PK);
      const gameEscrowAccount = await program.account.gameEscrow.fetch(
        newGameEscrow2PK
      );

      expect(gameAccount.status).to.deep.equal({ resolved: {} });
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

    it("should successfully resolve a 4-player game where 3 win (0% fee)", async () => {
      // Get balances before resolving
      const user1BalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user2BalanceBefore = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const user3BalanceBefore = await connection.getTokenAccountBalance(
        user3TokenAccount
      );
      // This is the loser's account
      const user4BalanceBefore = await connection.getTokenAccountBalance(
        providerTokenAccount
      );
      const treasuryBalanceBefore = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );

      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame3PK,
        gameEscrow: newGameEscrow3PK,
        mint: mint,
        gameVault: newGameVault3PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      await program.methods
        .resolveGame(0)
        .accounts(accounts)
        .remainingAccounts([
          { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
          { pubkey: user2TokenAccount, isWritable: true, isSigner: false },
          { pubkey: user3TokenAccount, isWritable: true, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      const gameAccount = await program.account.game.fetch(newGame3PK);
      const gameEscrowAccount = await program.account.gameEscrow.fetch(
        newGameEscrow3PK
      );

      expect(gameAccount.status).to.deep.equal({ resolved: {} });
      expect(gameEscrowAccount.totalAmount.toNumber()).to.equal(0);

      const losersPool = new anchor.BN(entryFeeRaw);
      const numWinners = new anchor.BN(3);
      const winningsPerWinner = losersPool.div(numWinners);
      const remainderToTreasury = losersPool.mod(numWinners);
      const totalPayoutPerWinner = new anchor.BN(entryFeeRaw).add(
        winningsPerWinner
      );

      // Assert treasury received ONLY the remainder
      const treasuryBalanceAfter = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );
      const treasuryChange = new anchor.BN(
        treasuryBalanceAfter.value.amount
      ).sub(new anchor.BN(treasuryBalanceBefore.value.amount));
      expect(treasuryChange.eq(remainderToTreasury)).to.be.true;

      // Assert each winner received the correct payout
      const user1BalanceAfter = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user1Change = new anchor.BN(user1BalanceAfter.value.amount).sub(
        new anchor.BN(user1BalanceBefore.value.amount)
      );
      expect(user1Change.eq(totalPayoutPerWinner)).to.be.true;

      const user2BalanceAfter = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const user2Change = new anchor.BN(user2BalanceAfter.value.amount).sub(
        new anchor.BN(user2BalanceBefore.value.amount)
      );
      expect(user2Change.eq(totalPayoutPerWinner)).to.be.true;

      const user3BalanceAfter = await connection.getTokenAccountBalance(
        user3TokenAccount
      );
      const user3Change = new anchor.BN(user3BalanceAfter.value.amount).sub(
        new anchor.BN(user3BalanceBefore.value.amount)
      );
      expect(user3Change.eq(totalPayoutPerWinner)).to.be.true;

      // Assert loser's balance is unchanged by this transaction
      const user4BalanceAfter = await connection.getTokenAccountBalance(
        providerTokenAccount
      );
      expect(user4BalanceAfter.value.amount).to.equal(
        user4BalanceBefore.value.amount
      );
    });

    it("should fail to resolve game if not admin", async () => {
      const accounts = {
        admin: user1.publicKey,
        game: newGame3PK,
        gameEscrow: newGameEscrow3PK,
        mint: mint,
        gameVault: newGameVault3PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      try {
        await program.methods
          .resolveGame(0)
          .accounts(accounts)
          .remainingAccounts([
            { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
            { pubkey: user2TokenAccount, isWritable: true, isSigner: false },
            { pubkey: user3TokenAccount, isWritable: true, isSigner: false },
          ])
          .signers([user1])
          .rpc();

        expect.fail("Should have failed with UnauthorizedGameResolution error");
      } catch (error) {
        expect(error).to.be.instanceOf(anchor.AnchorError);
        const anchorError = error as anchor.AnchorError;
        expect(anchorError.error.errorCode.code).to.equal(
          "UnauthorizedGameResolution"
        );
      }
    });

    it("should fail to resolve game if fee is too high", async () => {
      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame4PK,
        gameEscrow: newGameEscrow4PK,
        mint: mint,
        gameVault: newGameVault4PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      try {
        await program.methods
          .resolveGame(1001)
          .accounts(accounts)
          .remainingAccounts([
            { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
          ])
          .signers([adminKeypair])
          .rpc();

        expect.fail("Should have failed with ExcessiveFee error");
      } catch (error) {
        expect(error).to.be.instanceOf(anchor.AnchorError);
        const anchorError = error as anchor.AnchorError;
        expect(anchorError.error.errorCode.code).to.equal("ExcessiveFee");
      }
    });

    it("should fail to resolve an empty game because calculations are not complete", async () => {
      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame5PK,
        gameEscrow: newGameEscrow5PK,
        mint: mint,
        gameVault: newGameVault5PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      try {
        await program.methods
          .resolveGame(entryFeePercentage)
          .accounts(accounts)
          .remainingAccounts([])
          .signers([adminKeypair])
          .rpc();

        expect.fail(
          "Should have failed because the calculation complete flag is false"
        );
      } catch (error) {
        expect(error).to.be.instanceOf(anchor.AnchorError);
        const anchorError = error as anchor.AnchorError;
        expect(anchorError.error.errorCode.code).to.equal(
          "CalculationNotComplete"
        );
      }
    });

    it("should fail to resolve game with insufficient token accounts for winners", async () => {
      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame7PK,
        gameEscrow: newGameEscrow7PK,
        mint: mint,
        gameVault: newGameVault7PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      try {
        await program.methods
          .resolveGame(entryFeePercentage)
          .accounts(accounts)
          .remainingAccounts([
            { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
          ])
          .signers([adminKeypair])
          .rpc();

        expect.fail(
          "Should have failed due to incorrect number of winner accounts"
        );
      } catch (error) {
        expect(error).to.be.instanceOf(anchor.AnchorError);
        const anchorError = error as anchor.AnchorError;
        expect(anchorError.error.errorCode.code).to.equal(
          "IncorrectWinnerAccountCount"
        );
      }
    });

    it("should successfully resolve a 7-user game where 2 win with low fees", async () => {
      const user1BalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user2BalanceBefore = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const treasuryBalanceBefore = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );

      const lowFeePercentage = 100;

      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame7PK,
        gameEscrow: newGameEscrow7PK,
        mint: mint,
        gameVault: newGameVault7PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      await program.methods
        .resolveGame(lowFeePercentage)
        .accounts(accounts)
        .remainingAccounts([
          { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
          { pubkey: user2TokenAccount, isWritable: true, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      const numberOfLosers = new anchor.BN(5);
      const numberOfWinners = new anchor.BN(2);
      const entryFeeBN = new anchor.BN(entryFeeRaw);

      const losersPool = entryFeeBN.mul(numberOfLosers);
      const feeFromLosers = losersPool
        .mul(new anchor.BN(lowFeePercentage))
        .div(new anchor.BN(10000));
      const netLosersPool = losersPool.sub(feeFromLosers);

      const winningsPerWinner = netLosersPool.div(numberOfWinners);
      const remainderToTreasury = netLosersPool.mod(numberOfWinners);
      const totalPayoutPerWinner = entryFeeBN.add(winningsPerWinner);
      const expectedTreasuryAmount = feeFromLosers.add(remainderToTreasury);

      // Check that the treasury received the correct fees + remainder
      const treasuryBalanceAfter = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );
      const treasuryChange = new anchor.BN(
        treasuryBalanceAfter.value.amount
      ).sub(new anchor.BN(treasuryBalanceBefore.value.amount));
      expect(treasuryChange.toString()).to.equal(
        expectedTreasuryAmount.toString()
      );

      // Check that the winners received the correct payout
      const user1BalanceAfter = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user1Change = new anchor.BN(user1BalanceAfter.value.amount).sub(
        new anchor.BN(user1BalanceBefore.value.amount)
      );
      expect(user1Change.toString()).to.equal(totalPayoutPerWinner.toString());

      const user2BalanceAfter = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const user2Change = new anchor.BN(user2BalanceAfter.value.amount).sub(
        new anchor.BN(user2BalanceBefore.value.amount)
      );
      expect(user2Change.toString()).to.equal(totalPayoutPerWinner.toString());
    });

    it("should successfully resolve a 5-user game where 4 win with medium fees", async () => {
      const user1BalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user2BalanceBefore = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const user3BalanceBefore = await connection.getTokenAccountBalance(
        user3TokenAccount
      );
      const providerBalanceBefore = await connection.getTokenAccountBalance(
        providerTokenAccount
      );
      const treasuryBalanceBefore = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );

      const mediumFeePercentage = 400;

      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame8PK,
        gameEscrow: newGameEscrow8PK,
        mint: mint,
        gameVault: newGameVault8PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      await program.methods
        .resolveGame(mediumFeePercentage)
        .accounts(accounts)
        .remainingAccounts([
          { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
          { pubkey: user2TokenAccount, isWritable: true, isSigner: false },
          { pubkey: providerTokenAccount, isWritable: true, isSigner: false },
          { pubkey: user4TokenAccount, isWritable: true, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      const numberOfLosers = new anchor.BN(1);
      const numberOfWinners = new anchor.BN(4);
      const entryFeeBN = new anchor.BN(entryFeeRaw);

      const losersPool = entryFeeBN.mul(numberOfLosers);
      const feeFromLosers = losersPool
        .mul(new anchor.BN(mediumFeePercentage))
        .div(new anchor.BN(10000));
      const netLosersPool = losersPool.sub(feeFromLosers);

      const winningsPerWinner = netLosersPool.div(numberOfWinners);
      const remainderToTreasury = netLosersPool.mod(numberOfWinners);
      const totalPayoutPerWinner = entryFeeBN.add(winningsPerWinner);
      const expectedTreasuryAmount = feeFromLosers.add(remainderToTreasury);

      // Check that the treasury received the correct fees + remainder
      const treasuryBalanceAfter = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );
      const treasuryChange = new anchor.BN(
        treasuryBalanceAfter.value.amount
      ).sub(new anchor.BN(treasuryBalanceBefore.value.amount));
      expect(treasuryChange.toString()).to.equal(
        expectedTreasuryAmount.toString()
      );

      // Check that the winners received the correct payout
      const user1BalanceAfter = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user1Change = new anchor.BN(user1BalanceAfter.value.amount).sub(
        new anchor.BN(user1BalanceBefore.value.amount)
      );
      expect(user1Change.toString()).to.equal(totalPayoutPerWinner.toString());

      const user2BalanceAfter = await connection.getTokenAccountBalance(
        user2TokenAccount
      );
      const user2Change = new anchor.BN(user2BalanceAfter.value.amount).sub(
        new anchor.BN(user2BalanceBefore.value.amount)
      );
      expect(user2Change.toString()).to.equal(totalPayoutPerWinner.toString());

      const providerBalanceAfter = await connection.getTokenAccountBalance(
        providerTokenAccount
      );
      const providerChange = new anchor.BN(
        providerBalanceAfter.value.amount
      ).sub(new anchor.BN(providerBalanceBefore.value.amount));
      expect(providerChange.toString()).to.equal(
        totalPayoutPerWinner.toString()
      );
    });

    it("should successfully resolve a single-user game", async () => {
      const user1BalanceBefore = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const treasuryBalanceBefore = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );

      const accounts = {
        admin: adminKeypair.publicKey,
        game: newGame14PK,
        gameEscrow: newGameEscrow14PK,
        mint: mint,
        gameVault: newGameVault14PK,
        treasury: treasury.publicKey,
        treasuryVault: treasuryTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      await program.methods
        .resolveGame(0)
        .accounts(accounts)
        .remainingAccounts([
          { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      // Assert that the user got their exact entry fee back
      const user1BalanceAfter = await connection.getTokenAccountBalance(
        user1TokenAccount
      );
      const user1Change = new anchor.BN(user1BalanceAfter.value.amount).sub(
        new anchor.BN(user1BalanceBefore.value.amount)
      );
      expect(user1Change.toString()).to.equal(entryFeeRaw.toString());

      // Assert that the treasury balance is unchanged
      const treasuryBalanceAfter = await connection.getTokenAccountBalance(
        treasuryTokenAccount
      );
      const treasuryChange = new anchor.BN(
        treasuryBalanceAfter.value.amount
      ).sub(new anchor.BN(treasuryBalanceBefore.value.amount));
      expect(treasuryChange.toNumber()).to.equal(0);

      // Assert that the game is marked as resolved
      const gameAccount = await program.account.game.fetch(newGame14PK);
      expect(gameAccount.status).to.deep.equal({ resolved: {} });
    });
  });
});
