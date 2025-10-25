import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { RalliBet } from "../target/types/ralli_bet";
import { expect, assert } from "chai";
import { Connection, PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const keypairPath = path.resolve(process.env.HOME!, ".config/solana/id.json");
const secretKey = Uint8Array.from(
  JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
);
const adminKeypair = Keypair.fromSecretKey(secretKey);
const wallet = new anchor.Wallet(adminKeypair);
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
anchor.setProvider(provider);
const program = anchor.workspace.RalliBet as Program<RalliBet>;
const admin = adminKeypair.publicKey;

const getValidatorTime = async (): Promise<number> => {
  const slot = await provider.connection.getSlot();
  return provider.connection.getBlockTime(slot);
};

const findPdas = (
  playerId: string,
  matchupId: BN,
  statId: number,
  lineValue?: number
) => {
  const [linePointerPK] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("line_pointer"),
      Buffer.from(playerId),
      matchupId.toArrayLike(Buffer, "le", 8),
      new BN(statId).toArrayLike(Buffer, "le", 2),
    ],
    program.programId
  );

  let playerLinePK: PublicKey | null = null;
  if (lineValue !== undefined) {
    [playerLinePK] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("player_line"),
        Buffer.from(playerId),
        matchupId.toArrayLike(Buffer, "le", 8),
        new BN(statId).toArrayLike(Buffer, "le", 2),
        new BN(lineValue).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );
  }

  return { linePointerPK, playerLinePK };
};

const expectError = async (
  promise: Promise<any>,
  expectedErrorName: string
) => {
  try {
    await promise;
    assert.fail("Transaction should have failed but it succeeded.");
  } catch (error) {
    expect(error.toString()).to.include(expectedErrorName);
  }
};

describe("RalliBet - PlayerLine Management (V2)", () => {
  describe("Create Line V2 Tests", () => {
    let validatorTime: number;
    let basePlayerId: string;
    let baseMatchupId: BN;
    let baseStatId: number;
    let baseStartsAt: BN;
    let nonAdmin: Keypair;

    before(async () => {
      nonAdmin = Keypair.generate();
      const airdropSig = await provider.connection.requestAirdrop(
        nonAdmin.publicKey,
        1 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig, "confirmed");
    });

    beforeEach(async () => {
      validatorTime = await getValidatorTime();
      basePlayerId = `PLAYER_${Date.now()}`;
      baseMatchupId = new BN(2025102600 + Math.floor(Math.random() * 1000));
      baseStatId = 1001;
      baseStartsAt = new BN(validatorTime + 60); // 1 min in the future
    });

    it("should create a new PlayerLine and initialize a LinePointer", async () => {
      const lineValue = 2550;
      const odds = -110;
      const { linePointerPK, playerLinePK } = findPdas(
        basePlayerId,
        baseMatchupId,
        baseStatId,
        lineValue
      );

      // Create the line
      await program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          lineValue,
          odds,
          baseStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      const lineData = await program.account.playerLine.fetch(playerLinePK);
      expect(lineData.playerId).to.equal(basePlayerId);
      expect(lineData.matchupId.toString()).to.equal(baseMatchupId.toString());
      expect(lineData.statId).to.equal(baseStatId);
      expect(lineData.lineValue).to.equal(lineValue);
      expect(lineData.odds).to.equal(odds);
      expect(lineData.startsAt.toString()).to.equal(baseStartsAt.toString());
      expect(lineData.result).to.be.null;
      expect(lineData.isActive).to.be.true;

      // Verify LinePointer data
      const pointerData = await program.account.linePointer.fetch(
        linePointerPK
      );
      expect(pointerData.currentLineValue).to.equal(lineValue);
      expect(pointerData.currentOdds).to.equal(odds);
      expect(pointerData.currentLinePubkey.toBase58()).to.equal(
        playerLinePK.toBase58()
      );
    });

    it("should create a new PlayerLine and update an existing LinePointer", async () => {
      const lineValue1 = 2550;
      const odds1 = -110;
      const lineValue2 = 2650;
      const odds2 = -115;

      const { linePointerPK, playerLinePK: playerLine1PK } = findPdas(
        basePlayerId,
        baseMatchupId,
        baseStatId,
        lineValue1
      );
      const { playerLinePK: playerLine2PK } = findPdas(
        basePlayerId,
        baseMatchupId,
        baseStatId,
        lineValue2
      );

      // 1. Create the first line
      await program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          lineValue1,
          odds1,
          baseStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: playerLine1PK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      const pointerData1 = await program.account.linePointer.fetch(
        linePointerPK
      );
      expect(pointerData1.currentLinePubkey.toBase58()).to.equal(
        playerLine1PK.toBase58()
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          lineValue2,
          odds2,
          baseStartsAt.add(new BN(5))
        )
        .accounts({
          admin: admin,
          playerLine: playerLine2PK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      const pointerData2 = await program.account.linePointer.fetch(
        linePointerPK
      );
      expect(pointerData2.currentLineValue).to.equal(lineValue2);
      expect(pointerData2.currentOdds).to.equal(odds2);
      expect(pointerData2.currentLinePubkey.toBase58()).to.equal(
        playerLine2PK.toBase58()
      );
      expect(pointerData2.lastUpdated.toNumber()).to.be.greaterThan(
        pointerData1.lastUpdated.toNumber()
      );
    });

    it("should fail to create a line with a start time in the past", async () => {
      const pastTime = new BN(validatorTime - 60); // 1 min in the past
      const { linePointerPK, playerLinePK } = findPdas(
        basePlayerId,
        baseMatchupId,
        baseStatId,
        2550
      );
      const promise = program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          2550,
          -110,
          pastTime
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "InvalidLineStartTime");
    });

    it("should fail to create a line with a stat_id of 0", async () => {
      const invalidStatId = 0;
      const { linePointerPK, playerLinePK } = findPdas(
        basePlayerId,
        baseMatchupId,
        invalidStatId,
        2550
      );
      const promise = program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          invalidStatId,
          2550,
          -110,
          baseStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "InvalidStatId");
    });

    it("should fail to create a line with an empty player_id", async () => {
      const invalidPlayerId = "";
      const { linePointerPK, playerLinePK } = findPdas(
        invalidPlayerId,
        baseMatchupId,
        baseStatId,
        2550
      );
      const promise = program.methods
        .createLineV2(
          invalidPlayerId,
          baseMatchupId,
          baseStatId,
          2550,
          -110,
          baseStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "InvalidPlayerId");
    });

    it("should fail to create a line with a line_value of 0", async () => {
      const invalidLineValue = 0;
      const { linePointerPK, playerLinePK } = findPdas(
        basePlayerId,
        baseMatchupId,
        baseStatId,
        invalidLineValue
      );
      const promise = program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          invalidLineValue,
          -110,
          baseStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "InvalidLineValue");
    });

    it("should fail to create a line with odds of 0", async () => {
      const invalidOdds = 0;
      const { linePointerPK, playerLinePK } = findPdas(
        basePlayerId,
        baseMatchupId,
        baseStatId,
        2550
      );
      const promise = program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          2550,
          invalidOdds,
          baseStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "InvalidOdds");
    });

    it("should fail to create a line if not an admin", async () => {
      // Note: We expect an Anchor Constraint error, not our custom error,
      // because the signer constraint is checked first.
      const { linePointerPK, playerLinePK } = findPdas(
        basePlayerId,
        baseMatchupId,
        baseStatId,
        2550
      );
      const promise = program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          2550,
          -110,
          baseStartsAt
        )
        .accounts({
          admin: nonAdmin.publicKey, // <-- Use non-admin public key
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([nonAdmin]) // <-- Sign with non-admin keypair
        .rpc();

      // The `require!(is_admin...` check will fire
      await expectError(promise, "UnauthorizedLineCreation");
    });

    it("should fail to create the exact same PlayerLine twice (PDA collision)", async () => {
      const lineValue = 2550;
      const { linePointerPK, playerLinePK } = findPdas(
        basePlayerId,
        baseMatchupId,
        baseStatId,
        lineValue
      );

      // 1. Create the line (this one should succeed)
      await program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          lineValue,
          -110,
          baseStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // 2. Try to create the exact same line again
      const promise = program.methods
        .createLineV2(
          basePlayerId,
          baseMatchupId,
          baseStatId,
          lineValue,
          -110,
          baseStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // This will fail because the `player_line` account is `init`
      await expectError(promise, "already in use");
    });
  });

  describe("Update Line Pointer Tests", () => {
    let nonAdmin: Keypair;
    let playerId: string;
    let matchupId: BN;
    let statId: number;
    let lineValue1: number;
    let odds1: number;
    let lineValue2: number;
    let odds2: number;
    let startsAt: BN;
    let linePointerPK: PublicKey;
    let playerLine1PK: PublicKey;
    let playerLine2PK: PublicKey;

    const setupState = async (startsAtOffset: number) => {
      const validatorTime = await getValidatorTime();
      playerId = `PLAYER_${Date.now()}`;
      matchupId = new BN(2025112000 + Math.floor(Math.random() * 1000));
      statId = 2001;
      lineValue1 = 850;
      odds1 = -110;
      lineValue2 = 950;
      odds2 = -115;
      startsAt = new BN(validatorTime + startsAtOffset);

      const pdas1 = findPdas(playerId, matchupId, statId, lineValue1);
      const pdas2 = findPdas(playerId, matchupId, statId, lineValue2);

      linePointerPK = pdas1.linePointerPK;
      playerLine1PK = pdas1.playerLinePK;
      playerLine2PK = pdas2.playerLinePK;

      // Create Line 1
      await program.methods
        .createLineV2(playerId, matchupId, statId, lineValue1, odds1, startsAt)
        .accounts({
          admin: admin,
          playerLine: playerLine1PK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Create Line 2 (this will move the pointer)
      await program.methods
        .createLineV2(playerId, matchupId, statId, lineValue2, odds2, startsAt)
        .accounts({
          admin: admin,
          playerLine: playerLine2PK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      const pointerData = await program.account.linePointer.fetch(
        linePointerPK
      );
      expect(pointerData.currentLinePubkey.toBase58()).to.equal(
        playerLine2PK.toBase58()
      );
    };

    before(async () => {
      // Create and fund a non-admin user once for failure tests
      nonAdmin = Keypair.generate();
      const airdropSig = await provider.connection.requestAirdrop(
        nonAdmin.publicKey,
        1 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig, "confirmed");
    });

    it("should successfully update the pointer from Line 2 back to Line 1", async () => {
      await setupState(60);

      // Update pointer to point back to Line 1
      await program.methods
        .updateLinePointer(playerId, matchupId, statId, lineValue1)
        .accounts({
          admin: admin,
          playerLine: playerLine1PK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      const pointerData = await program.account.linePointer.fetch(
        linePointerPK
      );
      expect(pointerData.currentLineValue).to.equal(lineValue1);
      expect(pointerData.currentOdds).to.equal(odds1);
      expect(pointerData.currentLinePubkey.toBase58()).to.equal(
        playerLine1PK.toBase58()
      );
    });

    it("should fail to update pointer if not an admin", async () => {
      await setupState(60);

      const promise = program.methods
        .updateLinePointer(playerId, matchupId, statId, lineValue1)
        .accounts({
          admin: nonAdmin.publicKey,
          playerLine: playerLine1PK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([nonAdmin]) //
        .rpc();

      await expectError(promise, "UnauthorizedLineUpdate");
    });

    it("should fail to update pointer if the line has already started", async () => {
      await setupState(2);

      // Wait for the line to start
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const promise = program.methods
        .updateLinePointer(playerId, matchupId, statId, lineValue1)
        .accounts({
          admin: admin,
          playerLine: playerLine1PK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "LineAlreadyStarted");
    });

    it("should fail to update pointer to a line that is already resolved", async () => {
      await setupState(10);

      // Wait for the line to start
      let validatorTime = 0;
      while (validatorTime < startsAt.toNumber()) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        validatorTime = await getValidatorTime();
      }

      // Resolve Line 1
      await program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue1,
          { over: {} },
          1000,
          false
        )
        .accounts({
          admin: admin,
          playerLine: playerLine1PK,
        })
        .signers([adminKeypair])
        .rpc();

      // Verify Line 1 is resolved
      const line1Data = await program.account.playerLine.fetch(playerLine1PK);
      expect(line1Data.result).to.not.be.null;

      // Now, try to update the pointer to the resolved Line 1
      const promise = program.methods
        .updateLinePointer(playerId, matchupId, statId, lineValue1)
        .accounts({
          admin: admin,
          playerLine: playerLine1PK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "LineAlreadyResolved");
    });

    it("should fail if target PlayerLine does not match pointer seeds", async () => {
      await setupState(60);

      // Create a line for a DIFFERENT player
      const differentPlayerId = "DIFFERENT_PLAYER";
      const differentStartsAt = new BN((await getValidatorTime()) + 60);
      const {
        linePointerPK: differentPointerPK,
        playerLinePK: differentPlayerLinePK,
      } = findPdas(differentPlayerId, matchupId, statId, lineValue1);

      await program.methods
        .createLineV2(
          differentPlayerId,
          matchupId,
          statId,
          lineValue1,
          odds1,
          differentStartsAt
        )
        .accounts({
          admin: admin,
          playerLine: differentPlayerLinePK,
          linePointer: differentPointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // Try to update the ORIGINAL pointer with the DIFFERENT line
      const promise = program.methods
        .updateLinePointer(playerId, matchupId, statId, lineValue1)
        .accounts({
          admin: admin,
          playerLine: differentPlayerLinePK, // <-- Mismatched line
          linePointer: linePointerPK, // <-- Original pointer
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();

      // This will fail on the `player_line` constraint check,
      // because the seeds `[player_id, matchup_id, stat_id, line_value1]`
      // will not produce the `differentPlayerLinePK`.
      // The instruction's internal `require_eq!` checks are redundant
      // with Anchor's seed constraints, but this tests the constraint.
      await expectError(promise, "ConstraintSeeds");
    });
  });

  describe("Resolve Line V2 Tests", () => {
    let nonAdmin: Keypair;
    let playerId: string;
    let matchupId: BN;
    let statId: number;
    let lineValue: number;
    let startsAt: BN;
    let playerLinePK: PublicKey;

    const setupLine = async (startsAtOffset: number) => {
      const validatorTime = await getValidatorTime();
      playerId = `PLAYER_${Date.now()}`;
      matchupId = new BN(2025120100 + Math.floor(Math.random() * 1000));
      statId = 3001;
      lineValue = 550;
      startsAt = new BN(validatorTime + startsAtOffset);

      const { linePointerPK, playerLinePK: linePK } = findPdas(
        playerId,
        matchupId,
        statId,
        lineValue
      );
      playerLinePK = linePK;

      await program.methods
        .createLineV2(playerId, matchupId, statId, lineValue, -110, startsAt)
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
          linePointer: linePointerPK,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminKeypair])
        .rpc();
    };

    const waitForLineToStart = async () => {
      let validatorTime = 0;
      while (validatorTime < startsAt.toNumber()) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        validatorTime = await getValidatorTime();
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    before(async () => {
      // Create and fund a non-admin user once for failure tests
      nonAdmin = Keypair.generate();
      const airdropSig = await provider.connection.requestAirdrop(
        nonAdmin.publicKey,
        1 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig, "confirmed");
    });

    it("should successfully resolve a line as OVER", async () => {
      await setupLine(5);
      await waitForLineToStart();

      const result = { over: {} };
      const actualValue = 600;
      const shouldRefund = false;

      await program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          result,
          actualValue,
          shouldRefund
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      // Verify data
      const lineData = await program.account.playerLine.fetch(playerLinePK);
      expect(lineData.result).to.deep.equal(result);
      expect(lineData.actualValue).to.equal(actualValue);
      expect(lineData.shouldRefundBettors).to.be.false;
    });

    it("should successfully resolve a line as UNDER", async () => {
      await setupLine(5);
      await waitForLineToStart();

      const result = { under: {} };
      const actualValue = 500;
      const shouldRefund = false;

      await program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          result,
          actualValue,
          shouldRefund
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      // Verify data
      const lineData = await program.account.playerLine.fetch(playerLinePK);
      expect(lineData.result).to.deep.equal(result);
      expect(lineData.actualValue).to.equal(actualValue);
      expect(lineData.shouldRefundBettors).to.be.false;
    });

    it("should successfully mark a line for REFUND", async () => {
      await setupLine(60);

      const result = { over: {} };
      const actualValue = 0;
      const shouldRefund = true;

      await program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          result,
          actualValue,
          shouldRefund
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      // Verify data
      const lineData = await program.account.playerLine.fetch(playerLinePK);
      expect(lineData.shouldRefundBettors).to.be.true;
      expect(lineData.result).to.be.null;
      expect(lineData.actualValue).to.be.null;
    });

    it("should fail to resolve if not an admin", async () => {
      await setupLine(5);
      await waitForLineToStart();

      const promise = program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          { over: {} },
          600,
          false
        )
        .accounts({
          admin: nonAdmin.publicKey,
          playerLine: playerLinePK,
        })
        .signers([nonAdmin])
        .rpc();

      await expectError(promise, "UnauthorizedLineResolution");
    });

    it("should fail to resolve a line that has not started", async () => {
      await setupLine(60);

      const promise = program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          { over: {} },
          600,
          false
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "LineNotStarted");
    });

    it("should fail to resolve a line that is already resolved", async () => {
      await setupLine(5);
      await waitForLineToStart();
      await program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          { over: {} },
          600,
          false
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      // 2. Try to resolve it again
      const promise = program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          { under: {} },
          500,
          false
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "LineAlreadyResolved");
    });

    it("should fail to resolve a line marked for refund", async () => {
      await setupLine(60);

      // 1. Mark for refund
      await program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          { over: {} },
          0,
          true
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      await waitForLineToStart();
      const promise = program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          { over: {} },
          600,
          false
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      // The check `player_line.result.is_none()` passes,
      // but `player_line.should_refund_bettors == false` fails.
      await expectError(promise, "LineShouldBeRefunded");
    });

    it("should fail to resolve OVER if actual_value is UNDER", async () => {
      await setupLine(5);
      await waitForLineToStart();

      const result = { over: {} };
      const actualValue = 500;

      const promise = program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          result,
          actualValue,
          false
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "DirectionMismatch");
    });

    it("should fail to resolve UNDER if actual_value is OVER", async () => {
      await setupLine(5);
      await waitForLineToStart();

      const result = { under: {} };
      const actualValue = 600;

      const promise = program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue,
          result,
          actualValue,
          false
        )
        .accounts({
          admin: admin,
          playerLine: playerLinePK,
        })
        .signers([adminKeypair])
        .rpc();

      await expectError(promise, "DirectionMismatch");
    });
  });
});
