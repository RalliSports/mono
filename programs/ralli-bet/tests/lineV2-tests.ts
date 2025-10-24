import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { RalliBet } from "../target/types/ralli_bet";
import { expect } from "chai";
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

describe("RalliBet - PlayerLine Management (V2)", () => {
  const playerId = "LEBRON_JAMES_23";
  const matchupId = new BN(2025102601);
  const statId = 1001;
  const lineValue1 = 2550;
  const odds1 = -110;
  const lineValue2 = 2650;
  const odds2 = -115;

  let startsAt: BN;
  let linePointerPK: PublicKey;
  let playerLine1PK: PublicKey;
  let playerLine2PK: PublicKey;

  const findPDAs = () => {
    [linePointerPK] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("line_pointer"),
        Buffer.from(playerId),
        matchupId.toArrayLike(Buffer, "le", 8),
        new BN(statId).toArrayLike(Buffer, "le", 2),
      ],
      program.programId
    );

    [playerLine1PK] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("player_line"),
        Buffer.from(playerId),
        matchupId.toArrayLike(Buffer, "le", 8),
        new BN(statId).toArrayLike(Buffer, "le", 2),
        new BN(lineValue1).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );

    [playerLine2PK] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("player_line"),
        Buffer.from(playerId),
        matchupId.toArrayLike(Buffer, "le", 8),
        new BN(statId).toArrayLike(Buffer, "le", 2),
        new BN(lineValue2).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );
  };

  before(async () => {
    findPDAs();
    const slot = await provider.connection.getSlot();
    const validatorTime = await provider.connection.getBlockTime(slot);

    startsAt = new BN(validatorTime + 15);
    console.log(
      `Validator time: ${validatorTime}, setting startsAt: ${startsAt.toString()}`
    );
  });

  it("1. Creates the first PlayerLine (25.5)", async () => {
    console.log(`\nCreating Line 1 (25.5) at: ${playerLine1PK.toBase58()}`);
    console.log(`Updating Pointer at: ${linePointerPK.toBase58()}`);

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

    const line1Data = await program.account.playerLine.fetch(playerLine1PK);
    expect(line1Data.playerId).to.equal(playerId);
    expect(line1Data.matchupId.toString()).to.equal(matchupId.toString());
    expect(line1Data.statId).to.equal(statId);
    expect(line1Data.lineValue).to.equal(lineValue1);
    expect(line1Data.odds).to.equal(odds1);
    expect(line1Data.startsAt.toString()).to.equal(startsAt.toString());
    expect(line1Data.result).to.be.null;
    expect(line1Data.isActive).to.be.true;

    const pointerData = await program.account.linePointer.fetch(linePointerPK);
    expect(pointerData.currentLineValue).to.equal(lineValue1);
    expect(pointerData.currentOdds).to.equal(odds1);
    expect(pointerData.currentLinePubkey.toBase58()).to.equal(
      playerLine1PK.toBase58()
    );
    console.log("✅ Line 1 created, pointer updated.");
  });

  it("2. Creates a second PlayerLine (26.5), auto-updates pointer", async () => {
    console.log(`\nCreating Line 2 (26.5) at: ${playerLine2PK.toBase58()}`);
    const startsAt2 = startsAt.add(new BN(5));

    await program.methods
      .createLineV2(playerId, matchupId, statId, lineValue2, odds2, startsAt2)
      .accounts({
        admin: admin,
        playerLine: playerLine2PK,
        linePointer: linePointerPK,
        systemProgram: SystemProgram.programId,
      })
      .signers([adminKeypair])
      .rpc();

    const line2Data = await program.account.playerLine.fetch(playerLine2PK);
    expect(line2Data.lineValue).to.equal(lineValue2);
    expect(line2Data.odds).to.equal(odds2);
    expect(line2Data.startsAt.toString()).to.equal(startsAt2.toString());

    const pointerData = await program.account.linePointer.fetch(linePointerPK);
    expect(pointerData.currentLineValue).to.equal(lineValue2);
    expect(pointerData.currentOdds).to.equal(odds2);
    expect(pointerData.currentLinePubkey.toBase58()).to.equal(
      playerLine2PK.toBase58()
    );
    console.log("✅ Line 2 created, pointer automatically moved to Line 2.");
  });

  it("3. Updates LinePointer to point back to Line 1 (25.5)", async () => {
    console.log("\nRolling pointer back to Line 1 (25.5)...");

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

    const pointerData = await program.account.linePointer.fetch(linePointerPK);
    expect(pointerData.currentLineValue).to.equal(lineValue1);
    expect(pointerData.currentOdds).to.equal(odds1);
    expect(pointerData.currentLinePubkey.toBase58()).to.equal(
      playerLine1PK.toBase58()
    );
    console.log("✅ Pointer successfully rolled back to Line 1.");
  });

  it("4. Fails to resolve Line 1 (25.5) before it starts", async () => {
    console.log("\nAttempting to resolve Line 1 early (should fail)...");
    const actualValue = 2800;
    const result = { over: {} };
    const shouldRefund = false;

    try {
      await program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue1,
          result,
          actualValue,
          shouldRefund
        )
        .accounts({
          admin: admin,
          playerLine: playerLine1PK,
        })
        .signers([adminKeypair])
        .rpc();
      expect.fail("Resolving line early should have failed.");
    } catch (error) {
      expect(error.toString()).to.include("LineNotStarted");
      console.log("✅ Correctly failed to resolve early.");
    }
  });

  it("5. Successfully resolves Line 1 (25.5) after it starts", async () => {
    console.log("\nWaiting for Line 1 to start (approx 15s total)...");

    let validatorTime = 0;
    while (validatorTime < startsAt.toNumber()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const slot = await provider.connection.getSlot();
      validatorTime = await provider.connection.getBlockTime(slot);
    }

    console.log("Line 1 has started. Resolving...");

    const actualValue = 2800;
    const result = { over: {} };
    const shouldRefund = false;

    await program.methods
      .resolveLineV2(
        playerId,
        matchupId,
        statId,
        lineValue1,
        result,
        actualValue,
        shouldRefund
      )
      .accounts({
        admin: admin,
        playerLine: playerLine1PK,
      })
      .signers([adminKeypair])
      .rpc();

    const line1Data = await program.account.playerLine.fetch(playerLine1PK);
    expect(line1Data.actualValue).to.equal(actualValue);
    expect(line1Data.result).to.deep.equal(result);
    expect(line1Data.shouldRefundBettors).to.be.false;
    console.log("✅ Line 1 successfully resolved to OVER.");
  });

  it("6. Fails to resolve Line 1 (25.5) a second time", async () => {
    console.log("\nAttempting to resolve Line 1 again (should fail)...");
    const actualValue = 3000;
    const result = { over: {} };
    const shouldRefund = false;

    try {
      await program.methods
        .resolveLineV2(
          playerId,
          matchupId,
          statId,
          lineValue1,
          result,
          actualValue,
          shouldRefund
        )
        .accounts({
          admin: admin,
          playerLine: playerLine1PK,
        })
        .signers([adminKeypair])
        .rpc();
      expect.fail("Resolving line twice should have failed.");
    } catch (error) {
      expect(error.toString()).to.include("LineAlreadyResolved");
      console.log("✅ Correctly failed to resolve twice.");
    }
  });

  it("7. Marks Line 2 (26.5) for refund", async () => {
    console.log("\nMarking Line 2 for refund...");
    const actualValue = 0;
    const result = { over: {} };
    const shouldRefund = true;

    await program.methods
      .resolveLineV2(
        playerId,
        matchupId,
        statId,
        lineValue2,
        result,
        actualValue,
        shouldRefund
      )
      .accounts({
        admin: admin,
        playerLine: playerLine2PK,
      })
      .signers([adminKeypair])
      .rpc();

    const line2Data = await program.account.playerLine.fetch(playerLine2PK);
    expect(line2Data.shouldRefundBettors).to.be.true;
    expect(line2Data.result).to.be.null;
    expect(line2Data.actualValue).to.be.null;
    console.log("✅ Line 2 successfully marked for refund.");
  });
});
