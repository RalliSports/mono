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
  let gameId: BN;
  let createdGame: PublicKey;
  let line1PK: PublicKey;
  let line2PK: PublicKey;
  let line3PK: PublicKey;
  let line4PK: PublicKey;
  let line5PK: PublicKey;
  let game: PublicKey;
  let gameEscrow: PublicKey;
  let gameResult: PublicKey;

  // Test users
  let user1: Keypair;
  let user2: Keypair;
  let user3: Keypair;
  let users: Keypair[];
  let lineId1: BN = new BN(123);
  let lineId2: BN = new BN(456);
  let lineId3: BN = new BN(789);
  let lineId4: BN = new BN(1011);
  let lineId5: BN = new BN(1012);
  let numberOfLines = 3;
  let lineIdError: BN = new BN(1000);
  let statIdError = 0;
  let statId1 = 1;
  let statId2 = 2;
  let statId3 = 3;
  let statId4 = 4;
  let statId5 = 5;
  let predictedValue1 = 17.5;
  let predictedValue2 = 22.5;
  let predictedValue3 = 57.5;
  let predictedValue4 = 100.5;
  let predictedValue5 = 10.5;
  let predictedValueError = 0;

  let athleteId1: BN = new BN(10001);
  let athleteId2: BN = new BN(10002);
  let athleteId3: BN = new BN(10003);
  let athleteId4: BN = new BN(10004);
  let athleteId5: BN = new BN(10005);
  let startsAt1: BN = new BN(
    Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000)
  );

  let startsAtSoon: BN = new BN(Math.floor((Date.now() + 5000) / 1000));
  let startsAtInvalid: BN = new BN(
    Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000)
  );

  const entryFee = new BN(LAMPORTS_PER_SOL * 0.001); // 0.001 SOL
  const maxUsers = 5;

  before(async () => {
    // Generate test users
    user1 = Keypair.generate();
    user2 = Keypair.generate();
    user3 = Keypair.generate();
    users = [user1, user2, user3];

    // Airdrop SOL to test users
    for (const user of users) {
      const signature = await connection.requestAirdrop(
        user.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);
    }
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

    [gameResult] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_result"), game.toBuffer()],
      program.programId
    );
  });

  describe("Create Game Tests", () => {
    it("should create a game successfully", async () => {
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
          systemProgram: SystemProgram.programId,
        })
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
          systemProgram: SystemProgram.programId,
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
            systemProgram: SystemProgram.programId,
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
            systemProgram: SystemProgram.programId,
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
            systemProgram: SystemProgram.programId,
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
            systemProgram: SystemProgram.programId,
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
      line1PK = line1;
      line2PK = line2;
      line3PK = line3;
      line4PK = line4;
      line5PK = line5;
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
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
    });

    it("should allow user to join game successfully", async () => {
      const userBalanceBefore = await connection.getBalance(user1.publicKey);
      const escrowBalanceBefore = await connection.getBalance(gameEscrow);

      const tx = await program.methods
        .joinGame()
        .accountsPartial({
          user: user1.publicKey,
          game: game,
          gameEscrow: gameEscrow,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();

      // Verify balances
      const userBalanceAfter = await connection.getBalance(user1.publicKey);
      const escrowBalanceAfter = await connection.getBalance(gameEscrow);

      expect(userBalanceBefore - userBalanceAfter).to.equal(
        entryFee.toNumber()
      );
      expect(escrowBalanceAfter - escrowBalanceBefore).to.equal(
        entryFee.toNumber()
      );

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
          systemProgram: SystemProgram.programId,
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

  // describe("Cancel Game Tests", () => {
  //   beforeEach(async () => {
  //     // Create game and have users join
  //     await program.methods
  //       .createGame(gameId, maxUsers, entryFee)
  //       .accountsPartial({
  //         creator: provider.wallet.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([keypair])
  //       .rpc();

  //     await program.methods
  //       .joinGame()
  //       .accountsPartial({
  //         user: user1.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([user1])
  //       .rpc();
  //   });

  //   it("should allow user to cancel and get refund", async () => {
  //     const userBalanceBefore = await connection.getBalance(user1.publicKey);
  //     const escrowBalanceBefore = await connection.getBalance(gameEscrow);

  //     const tx = await program.methods
  //       .cancelGame()
  //       .accountsPartial({
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         user: user1.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([user1])
  //       .rpc();

  //     const userBalanceAfter = await connection.getBalance(user1.publicKey);
  //     const escrowBalanceAfter = await connection.getBalance(gameEscrow);

  //     // User should get their entry fee back (minus transaction fees)
  //     expect(userBalanceAfter - userBalanceBefore).to.be.greaterThan(
  //       entryFee.toNumber() * 0.9
  //     );
  //     expect(escrowBalanceBefore - escrowBalanceAfter).to.equal(
  //       entryFee.toNumber()
  //     );

  //     // Verify game state
  //     const gameAccount = await program.account.game.fetch(game);
  //     expect(gameAccount.users).to.have.length(0);

  //     // Verify escrow state
  //     const escrowAccount = await program.account.gameEscrow.fetch(gameEscrow);
  //     expect(escrowAccount.totalAmount.toString()).to.equal("0");
  //   });
  // });

  // describe("Integration Tests", () => {
  //   it("should handle complete game lifecycle", async () => {
  //     // Create game
  //     await program.methods
  //       .createGame(gameId, 3, entryFee)
  //       .accountsPartial({
  //         creator: provider.wallet.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([keypair])
  //       .rpc();

  //     // Multiple users join
  //     await program.methods
  //       .joinGame()
  //       .accountsPartial({
  //         user: user1.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([user1])
  //       .rpc();

  //     await program.methods
  //       .joinGame()
  //       .accountsPartial({
  //         user: user2.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([user2])
  //       .rpc();

  //     // Verify final state
  //     const gameAccount = await program.account.game.fetch(game);
  //     expect(gameAccount.users).to.have.length(2);
  //     expect(gameAccount.status).to.deep.equal({ open: {} });

  //     const escrowAccount = await program.account.gameEscrow.fetch(gameEscrow);
  //     expect(escrowAccount.totalAmount.toString()).to.equal(
  //       entryFee.mul(new BN(2)).toString()
  //     );

  //     // One user cancels
  //     await program.methods
  //       .cancelGame()
  //       .accountsPartial({
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         user: user1.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([user1])
  //       .rpc();

  //     // Verify state after cancellation
  //     const gameAccountAfterCancel = await program.account.game.fetch(game);
  //     expect(gameAccountAfterCancel.users).to.have.length(1);
  //     expect(gameAccountAfterCancel.users[0].toString()).to.equal(
  //       user2.publicKey.toString()
  //     );

  //     const escrowAccountAfterCancel = await program.account.gameEscrow.fetch(
  //       gameEscrow
  //     );
  //     expect(escrowAccountAfterCancel.totalAmount.toString()).to.equal(
  //       entryFee.toString()
  //     );
  //   });

  //   it("should handle edge case with insufficient funds", async () => {
  //     // Create a user with insufficient funds
  //     const poorUser = Keypair.generate();
  //     const signature = await connection.requestAirdrop(
  //       poorUser.publicKey,
  //       1000
  //     ); // Very small amount
  //     await connection.confirmTransaction(signature);

  //     // Create game
  //     await program.methods
  //       .createGame(gameId, maxUsers, entryFee)
  //       .accountsPartial({
  //         creator: provider.wallet.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([keypair])
  //       .rpc();

  //     // Try to join with insufficient funds
  //     try {
  //       await program.methods
  //         .joinGame()
  //         .accountsPartial({
  //           user: poorUser.publicKey,
  //           game: game,
  //           gameEscrow: gameEscrow,
  //           systemProgram: SystemProgram.programId,
  //         })
  //         .signers([poorUser])
  //         .rpc();
  //       expect.fail("Should have failed due to insufficient funds");
  //     } catch (error) {
  //       // This should fail due to insufficient lamports
  //       expect(error).to.exist;
  //     }
  //   });
  // });

  // describe("Account State Verification", () => {
  //   it("should maintain correct account relationships", async () => {
  //     await program.methods
  //       .createGame(gameId, maxUsers, entryFee)
  //       .accountsPartial({
  //         creator: provider.wallet.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([keypair])
  //       .rpc();

  //     const gameAccount = await program.account.game.fetch(game);
  //     const escrowAccount = await program.account.gameEscrow.fetch(gameEscrow);

  //     // Verify PDA relationships
  //     expect(escrowAccount.game.toString()).to.equal(game.toString());
  //     expect(gameAccount.creator.toString()).to.equal(
  //       provider.wallet.publicKey.toString()
  //     );

  //     // Verify initial state
  //     expect(gameAccount.users).to.be.empty;
  //     expect(escrowAccount.totalAmount.toString()).to.equal("0");
  //   });

  //   it("should have correct bump values", async () => {
  //     await program.methods
  //       .createGame(gameId, maxUsers, entryFee)
  //       .accountsPartial({
  //         creator: provider.wallet.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([keypair])
  //       .rpc();

  //     const gameAccount = await program.account.game.fetch(game);
  //     const escrowAccount = await program.account.gameEscrow.fetch(gameEscrow);

  //     // Verify bumps are within valid range
  //     expect(gameAccount.bump).to.be.greaterThan(0);
  //     expect(gameAccount.bump).to.be.lessThan(256);
  //     expect(escrowAccount.bump).to.be.greaterThan(0);
  //     expect(escrowAccount.bump).to.be.lessThan(256);
  //   });
  // });

  // describe("Error Handling", () => {
  //   it("should handle invalid account scenarios", async () => {
  //     // Try to join a game that doesn't exist
  //     const fakeGameId = new BN(999999);
  //     const [fakeGame] = PublicKey.findProgramAddressSync(
  //       [Buffer.from("game"), fakeGameId.toArrayLike(Buffer, "le", 8)],
  //       program.programId
  //     );
  //     const [fakeGameEscrow] = PublicKey.findProgramAddressSync(
  //       [Buffer.from("escrow"), fakeGame.toBuffer()],
  //       program.programId
  //     );

  //     try {
  //       await program.methods
  //         .joinGame()
  //         .accountsPartial({
  //           user: user1.publicKey,
  //           game: fakeGame,
  //           gameEscrow: fakeGameEscrow,
  //           systemProgram: SystemProgram.programId,
  //         })
  //         .signers([user1])
  //         .rpc();
  //       expect.fail("Should have failed with account not initialized");
  //     } catch (error) {
  //       expect(error).to.exist;
  //     }
  //   });
  // });

  // describe("Refund Entry Tests", () => {
  //   beforeEach(async () => {
  //     // Create game and have users join
  //     await program.methods
  //       .createGame(gameId, maxUsers, entryFee)
  //       .accountsPartial({
  //         creator: provider.wallet.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([keypair])
  //       .rpc();

  //     // Have users join
  //     await program.methods
  //       .joinGame()
  //       .accountsPartial({
  //         user: user1.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([user1])
  //       .rpc();

  //     await program.methods
  //       .joinGame()
  //       .accountsPartial({
  //         user: user2.publicKey,
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([user2])
  //       .rpc();
  //   });

  //   it("should successfully refund all users when called by game creator", async () => {
  //     const user1BalanceBefore = await connection.getBalance(user1.publicKey);
  //     const user2BalanceBefore = await connection.getBalance(user2.publicKey);

  //     await program.methods
  //       .refundEntry()
  //       .accountsPartial({
  //         game: game,
  //         gameEscrow: gameEscrow,
  //         gameResult: gameResult,
  //         gameCreator: provider.wallet.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .remainingAccounts([
  //         { pubkey: user1.publicKey, isWritable: true, isSigner: false },
  //         { pubkey: user2.publicKey, isWritable: true, isSigner: false },
  //       ])
  //       .signers([keypair])
  //       .rpc();

  //     // Verify users got refunded
  //     const user1BalanceAfter = await connection.getBalance(user1.publicKey);
  //     const user2BalanceAfter = await connection.getBalance(user2.publicKey);

  //     expect(user1BalanceAfter - user1BalanceBefore).to.equal(
  //       entryFee.toNumber()
  //     );
  //     expect(user2BalanceAfter - user2BalanceBefore).to.equal(
  //       entryFee.toNumber()
  //     );

  //     // Verify game state
  //     const gameAccount = await program.account.game.fetch(game);
  //     expect(gameAccount.users).to.have.length(0);
  //     expect(gameAccount.status).to.deep.equal({ cancelled: {} });
  //   });

  //   it("should fail when called by non-creator", async () => {
  //     try {
  //       await program.methods
  //         .refundEntry()
  //         .accountsPartial({
  //           game: game,
  //           gameEscrow: gameEscrow,
  //           gameResult: gameResult,
  //           gameCreator: user1.publicKey, // Not the creator
  //           systemProgram: SystemProgram.programId,
  //         })
  //         .remainingAccounts([
  //           { pubkey: user1.publicKey, isWritable: true, isSigner: false },
  //           { pubkey: user2.publicKey, isWritable: true, isSigner: false },
  //         ])
  //         .signers([user1])
  //         .rpc();
  //       expect.fail("Should have failed with UnauthorizedRefund");
  //     } catch (error) {
  //       expect(error.toString()).to.include("Error Code: UnauthorizedRefund");
  //     }
  //   });

  //   it("should fail when remaining accounts don't match game users", async () => {
  //     try {
  //       await program.methods
  //         .refundEntry()
  //         .accountsPartial({
  //           game: game,
  //           gameEscrow: gameEscrow,
  //           gameResult: gameResult,
  //           gameCreator: provider.wallet.publicKey,
  //           systemProgram: SystemProgram.programId,
  //         })
  //         .remainingAccounts([
  //           { pubkey: user1.publicKey, isWritable: true, isSigner: false },
  //           { pubkey: user3.publicKey, isWritable: true, isSigner: false }, // Wrong user
  //         ])
  //         .signers([keypair])
  //         .rpc();
  //       expect.fail("Should have failed with AccountMismatch");
  //     } catch (error) {
  //       expect(error.toString()).to.include("Error Code: AccountMismatch");
  //     }
  //   });
  // });
});
