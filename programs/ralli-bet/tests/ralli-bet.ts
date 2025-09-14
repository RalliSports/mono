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
  let user: Keypair;
  let user1TokenAccount: PublicKey;
  let user2TokenAccount: PublicKey;
  let user3TokenAccount: PublicKey;
  let user4TokenAccount: PublicKey;
  let user5TokenAccount: PublicKey;
  let user6TokenAccount: PublicKey;
  let user7TokenAccount: PublicKey;
  let userTokenAccount: PublicKey;
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
    user = Keypair.generate();
    users = [user1, user2, user3, user4, user5, user6, user7, user, treasury];

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
});
