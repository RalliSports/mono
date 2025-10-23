import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RalliBet } from "../target/types/ralli_bet";
import { Connection, PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createMint,
  mintTo,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { expect } from "chai";
import BN from "bn.js";
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

describe("RalliBet - Batch Resolution Tests", () => {
  // Keypairs
  let treasury: Keypair;
  let user1: Keypair;
  let user2: Keypair;
  let user3: Keypair;
  let user4: Keypair;
  let user5: Keypair;

  // Token accounts
  let mint: PublicKey;
  let adminTokenAccount: PublicKey;
  let treasuryTokenAccount: PublicKey;
  let user1TokenAccount: PublicKey;
  let user2TokenAccount: PublicKey;
  let user3TokenAccount: PublicKey;
  let user4TokenAccount: PublicKey;
  let user5TokenAccount: PublicKey;

  // Game related
  let gameId: BN;
  let gamePK: PublicKey;
  let gameEscrowPK: PublicKey;
  let gameVaultPK: PublicKey;

  // Lines
  let lineId1: BN;
  let lineId2: BN;
  let lineId3: BN;
  let line1PK: PublicKey;
  let line2PK: PublicKey;
  let line3PK: PublicKey;

  // Bets
  let bet1PK: PublicKey;
  let bet2PK: PublicKey;
  let bet3PK: PublicKey;
  let bet4PK: PublicKey;
  let bet5PK: PublicKey;

  const entryFeeRaw = 1_000_000;
  const statId1 = 5001;
  const statId2 = 5002;
  const statId3 = 5003;
  const predictedValue1 = 25.0;
  const predictedValue2 = 12.0;
  const predictedValue3 = 8.0;
  const athleteId1 = new BN(5501);
  const athleteId2 = new BN(5502);
  const athleteId3 = new BN(5503);

  before(async () => {
    console.log("\n🚀 Setting up test environment...\n");
    console.log("✅ Using admin keypair:", adminKeypair.publicKey.toBase58());

    treasury = Keypair.generate();
    user1 = Keypair.generate();
    user2 = Keypair.generate();
    user3 = Keypair.generate();
    user4 = Keypair.generate();
    user5 = Keypair.generate();

    const accounts = [
      treasury.publicKey,
      user1.publicKey,
      user2.publicKey,
      user3.publicKey,
      user4.publicKey,
      user5.publicKey,
    ];

    for (const account of accounts) {
      const signature = await connection.requestAirdrop(
        account,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);
    }

    // Create mint (simulating USDC with 6 decimals)
    mint = await createMint(
      connection,
      adminKeypair,
      adminKeypair.publicKey,
      null,
      6
    );

    console.log("✅ Mint created:", mint.toBase58());

    // Create token accounts
    const adminAta = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      mint,
      adminKeypair.publicKey
    );
    adminTokenAccount = adminAta.address;

    const treasuryAta = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      mint,
      treasury.publicKey
    );
    treasuryTokenAccount = treasuryAta.address;

    const user1Ata = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      mint,
      user1.publicKey
    );
    user1TokenAccount = user1Ata.address;

    const user2Ata = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      mint,
      user2.publicKey
    );
    user2TokenAccount = user2Ata.address;

    const user3Ata = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      mint,
      user3.publicKey
    );
    user3TokenAccount = user3Ata.address;

    const user4Ata = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      mint,
      user4.publicKey
    );
    user4TokenAccount = user4Ata.address;

    const user5Ata = await getOrCreateAssociatedTokenAccount(
      connection,
      adminKeypair,
      mint,
      user5.publicKey
    );
    user5TokenAccount = user5Ata.address;

    // Mint tokens to users (each gets 10 USDC worth)
    const mintAmount = 10_000_000; // 10 USDC
    await mintTo(
      connection,
      adminKeypair,
      mint,
      user1TokenAccount,
      adminKeypair,
      mintAmount
    );
    await mintTo(
      connection,
      adminKeypair,
      mint,
      user2TokenAccount,
      adminKeypair,
      mintAmount
    );
    await mintTo(
      connection,
      adminKeypair,
      mint,
      user3TokenAccount,
      adminKeypair,
      mintAmount
    );
    await mintTo(
      connection,
      adminKeypair,
      mint,
      user4TokenAccount,
      adminKeypair,
      mintAmount
    );
    await mintTo(
      connection,
      adminKeypair,
      mint,
      user5TokenAccount,
      adminKeypair,
      mintAmount
    );

    console.log("✅ Token accounts created and funded");

    const startTime = new BN(Math.floor(Date.now() / 1000) + 10); // Start in 10 seconds

    lineId1 = new BN(10001 + Date.now()); // Use timestamp to ensure uniqueness
    lineId2 = new BN(10002 + Date.now());
    lineId3 = new BN(10003 + Date.now());

    [line1PK] = PublicKey.findProgramAddressSync(
      [Buffer.from("line"), lineId1.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    [line2PK] = PublicKey.findProgramAddressSync(
      [Buffer.from("line"), lineId2.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    [line3PK] = PublicKey.findProgramAddressSync(
      [Buffer.from("line"), lineId3.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .createLine(lineId1, statId1, predictedValue1, athleteId1, startTime)
      .accountsPartial({
        admin: adminKeypair.publicKey,
        line: line1PK,
        systemProgram: SystemProgram.programId,
      })
      .signers([adminKeypair])
      .rpc();

    await program.methods
      .createLine(lineId2, statId2, predictedValue2, athleteId2, startTime)
      .accountsPartial({
        admin: adminKeypair.publicKey,
        line: line2PK,
        systemProgram: SystemProgram.programId,
      })
      .signers([adminKeypair])
      .rpc();

    await program.methods
      .createLine(lineId3, statId3, predictedValue3, athleteId3, startTime)
      .accountsPartial({
        admin: adminKeypair.publicKey,
        line: line3PK,
        systemProgram: SystemProgram.programId,
      })
      .signers([adminKeypair])
      .rpc();

    console.log("✅ 3 Lines created");

    // Create game
    gameId = new BN(50001 + Date.now()); // Use timestamp for uniqueness
    const entryFee = new BN(entryFeeRaw);

    [gamePK] = PublicKey.findProgramAddressSync(
      [Buffer.from("game"), gameId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    [gameEscrowPK] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), gamePK.toBuffer()],
      program.programId
    );

    gameVaultPK = await getAssociatedTokenAddress(mint, gamePK, true);

    const maxUsers = 10;
    const numberOfLines = 3;

    await program.methods
      .createGame(
        gameId,
        maxUsers,
        entryFee,
        numberOfLines,
        adminKeypair.publicKey
      )
      .accountsPartial({
        creator: adminKeypair.publicKey,
        game: gamePK,
        gameEscrow: gameEscrowPK,
        mint: mint,
        gameVault: gameVaultPK,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([adminKeypair])
      .rpc();

    console.log("✅ Game created with ID:", gameId.toString());
  });

  it("Setup: 5 users join the game and pay entry fee", async () => {
    console.log("\n💰 Users joining game and paying entry fee...\n");

    // User1 joins
    await program.methods
      .joinGame()
      .accountsPartial({
        user: user1.publicKey,
        game: gamePK,
        gameEscrow: gameEscrowPK,
        mint: mint,
        userTokens: user1TokenAccount,
        gameVault: gameVaultPK,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user1])
      .rpc();

    // User2 joins
    await program.methods
      .joinGame()
      .accountsPartial({
        user: user2.publicKey,
        game: gamePK,
        gameEscrow: gameEscrowPK,
        mint: mint,
        userTokens: user2TokenAccount,
        gameVault: gameVaultPK,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user2])
      .rpc();

    // User3 joins
    await program.methods
      .joinGame()
      .accountsPartial({
        user: user3.publicKey,
        game: gamePK,
        gameEscrow: gameEscrowPK,
        mint: mint,
        userTokens: user3TokenAccount,
        gameVault: gameVaultPK,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user3])
      .rpc();

    // User4 joins
    await program.methods
      .joinGame()
      .accountsPartial({
        user: user4.publicKey,
        game: gamePK,
        gameEscrow: gameEscrowPK,
        mint: mint,
        userTokens: user4TokenAccount,
        gameVault: gameVaultPK,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user4])
      .rpc();

    // User5 joins
    await program.methods
      .joinGame()
      .accountsPartial({
        user: user5.publicKey,
        game: gamePK,
        gameEscrow: gameEscrowPK,
        mint: mint,
        userTokens: user5TokenAccount,
        gameVault: gameVaultPK,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user5])
      .rpc();

    const gameData = await program.account.game.fetch(gamePK);
    expect(gameData.users.length).to.equal(5);
    console.log("✅ All 5 users have joined and paid entry fee");
  });

  it("Setup: 5 users place bets (picks for all 3 lines)", async () => {
    console.log("\n📝 Users placing bets (parlay picks)...\n");

    // User1 bets: Line1 OVER, Line2 UNDER, Line3 UNDER → Will get ALL 3 correct ✅
    [bet1PK] = PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), gamePK.toBuffer(), user1.publicKey.toBuffer()],
      program.programId
    );

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
          direction: { under: {} },
        },
      ])
      .accountsPartial({
        user: user1.publicKey,
        game: gamePK,
        bet: bet1PK,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([user1])
      .rpc();

    // User2 bets: Line1 OVER, Line2 UNDER, Line3 UNDER → Will get ALL 3 correct ✅
    [bet2PK] = PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), gamePK.toBuffer(), user2.publicKey.toBuffer()],
      program.programId
    );

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
          direction: { under: {} },
        },
      ])
      .accountsPartial({
        user: user2.publicKey,
        game: gamePK,
        bet: bet2PK,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([user2])
      .rpc();

    // User3 bets: Line1 UNDER, Line2 OVER, Line3 OVER → Will get 0 correct ❌
    [bet3PK] = PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), gamePK.toBuffer(), user3.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .submitBet([
        {
          lineId: line1PK,
          direction: { under: {} },
        },
        {
          lineId: line2PK,
          direction: { over: {} },
        },
        {
          lineId: line3PK,
          direction: { over: {} },
        },
      ])
      .accountsPartial({
        user: user3.publicKey,
        game: gamePK,
        bet: bet3PK,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([user3])
      .rpc();

    // User4 bets: Line1 OVER, Line2 OVER, Line3 OVER → Will get 1 correct (Line1 only) ❌
    [bet4PK] = PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), gamePK.toBuffer(), user4.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .submitBet([
        {
          lineId: line1PK,
          direction: { over: {} },
        },
        {
          lineId: line2PK,
          direction: { over: {} },
        },
        {
          lineId: line3PK,
          direction: { over: {} },
        },
      ])
      .accountsPartial({
        user: user4.publicKey,
        game: gamePK,
        bet: bet4PK,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([user4])
      .rpc();

    // User5 bets: Line1 UNDER, Line2 UNDER, Line3 OVER → Will get 2 correct (Line2, Line3 wrong) ❌
    [bet5PK] = PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), gamePK.toBuffer(), user5.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .submitBet([
        {
          lineId: line1PK,
          direction: { under: {} },
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
        user: user5.publicKey,
        game: gamePK,
        bet: bet5PK,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([user5])
      .rpc();

    console.log("✅ All 5 users have placed their parlay bets");
    console.log("   User1 picks: OVER, UNDER, UNDER");
    console.log("   User2 picks: OVER, UNDER, UNDER");
    console.log("   User3 picks: UNDER, OVER, OVER");
    console.log("   User4 picks: OVER, OVER, OVER");
    console.log("   User5 picks: UNDER, UNDER, OVER");
  });

  it("Setup: Resolve lines - Calculate parlay winners", async () => {
    console.log("\n⚖️ Resolving lines...\n");

    console.log(
      "⏳ Waiting for lines to start (this takes about 10 seconds)..."
    );
    await new Promise((resolve) => setTimeout(resolve, 11000));
    console.log("✅ Lines have started\n");

    // Line Results:
    // Line1: actualValue = 26.0 (> predictedValue 25.0) → OVER wins
    // Line2: actualValue = 10.0 (< predictedValue 12.0) → UNDER wins
    // Line3: actualValue = 6.0 (< predictedValue 8.0) → UNDER wins

    // Resolve Line1 as OVER (26.0 > 25.0)
    await program.methods
      .resolveLine({ over: {} }, 26.0, false)
      .accountsPartial({
        admin: adminKeypair.publicKey,
        line: line1PK,
      })
      .signers([adminKeypair])
      .rpc();

    // Resolve Line2 as UNDER (10.0 < 12.0)
    await program.methods
      .resolveLine({ under: {} }, 10.0, false)
      .accountsPartial({
        admin: adminKeypair.publicKey,
        line: line2PK,
      })
      .signers([adminKeypair])
      .rpc();

    // Resolve Line3 as UNDER (6.0 < 8.0)
    await program.methods
      .resolveLine({ under: {} }, 6.0, false)
      .accountsPartial({
        admin: adminKeypair.publicKey,
        line: line3PK,
      })
      .signers([adminKeypair])
      .rpc();

    console.log("✅ All lines resolved");
    console.log("   Line1: OVER wins (26.0 > 25.0)");
    console.log("   Line2: UNDER wins (10.0 < 12.0)");
    console.log("   Line3: UNDER wins (6.0 < 8.0)");
    console.log("\n📊 Parlay Results:");
    console.log("   User1: [OVER, UNDER, UNDER] → Gets ALL 3 correct ✅ WINS!");
    console.log("   User2: [OVER, UNDER, UNDER] → Gets ALL 3 correct ✅ WINS!");
    console.log("   User3: [UNDER, OVER, OVER] → Gets 0 correct ❌ LOSES");
    console.log("   User4: [OVER, OVER, OVER] → Gets 1 correct ❌ LOSES");
    console.log("   User5: [UNDER, UNDER, OVER] → Gets 2 correct ❌ LOSES");
    console.log("\n   ✅ WINNERS: User1 and User2 (got all 3 picks correct)");
    console.log("   ❌ LOSERS: User3, User4, User5");
  });

  it("Setup: Calculate game winners", async () => {
    console.log("\n🧮 Calculating game winners...\n");

    console.log("Step 1: Calculating correct picks for each bet...");

    // Calculate for User1's bet
    await program.methods
      .calculateCorrect()
      .accountsPartial({
        admin: adminKeypair.publicKey,
        game: gamePK,
        bet: bet1PK,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([adminKeypair])
      .rpc();

    // Calculate for User2's bet
    await program.methods
      .calculateCorrect()
      .accountsPartial({
        admin: adminKeypair.publicKey,
        game: gamePK,
        bet: bet2PK,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([adminKeypair])
      .rpc();

    // Calculate for User3's bet
    await program.methods
      .calculateCorrect()
      .accountsPartial({
        admin: adminKeypair.publicKey,
        game: gamePK,
        bet: bet3PK,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([adminKeypair])
      .rpc();

    // Calculate for User4's bet
    await program.methods
      .calculateCorrect()
      .accountsPartial({
        admin: adminKeypair.publicKey,
        game: gamePK,
        bet: bet4PK,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([adminKeypair])
      .rpc();

    // Calculate for User5's bet
    await program.methods
      .calculateCorrect()
      .accountsPartial({
        admin: adminKeypair.publicKey,
        game: gamePK,
        bet: bet5PK,
      })
      .remainingAccounts([
        { pubkey: line1PK, isWritable: false, isSigner: false },
        { pubkey: line2PK, isWritable: false, isSigner: false },
        { pubkey: line3PK, isWritable: false, isSigner: false },
      ])
      .signers([adminKeypair])
      .rpc();

    console.log("✅ Calculated correct picks for all 5 bets");

    console.log("\nStep 2: Calculating winners and finalizing...");

    await program.methods
      .calculateWinners()
      .accountsPartial({
        admin: adminKeypair.publicKey,
        game: gamePK,
      })
      .remainingAccounts([
        { pubkey: bet1PK, isWritable: false, isSigner: false },
        { pubkey: bet2PK, isWritable: false, isSigner: false },
        { pubkey: bet3PK, isWritable: false, isSigner: false },
        { pubkey: bet4PK, isWritable: false, isSigner: false },
        { pubkey: bet5PK, isWritable: false, isSigner: false },
      ])
      .signers([adminKeypair])
      .rpc();

    const gameData = await program.account.game.fetch(gamePK);
    expect(gameData.calculationComplete).to.be.true;
    expect(gameData.numWinners).to.equal(2);
    console.log("✅ Winners calculated: 2 winners (User1 & User2), 3 losers");
    console.log(
      `   Correct picks needed to win: ${gameData.correctVotesToBeWinner}`
    );
  });

  it("🎯 BATCH 1: Resolve game - Pay first winner (User1) with batch_index=0", async () => {
    console.log("\n" + "=".repeat(60));
    console.log("🎯 BATCH RESOLUTION TEST - BATCH 1 of 2");
    console.log("=".repeat(60));

    const user1BalanceBefore = await connection.getTokenAccountBalance(
      user1TokenAccount
    );
    const treasuryBalanceBefore = await connection.getTokenAccountBalance(
      treasuryTokenAccount
    );
    const bet1DataBefore = await program.account.bet.fetch(bet1PK);

    console.log("\n📊 Pre-Batch 1 State:");
    console.log(`   User1 Balance: ${user1BalanceBefore.value.amount}`);
    console.log(`   Treasury Balance: ${treasuryBalanceBefore.value.amount}`);
    console.log(`   User1 Bet Paid Status: ${bet1DataBefore.paid}`);
    expect(bet1DataBefore.paid).to.be.false;

    const feePercentage = 500; // 5% fee
    const accounts = {
      admin: adminKeypair.publicKey,
      game: gamePK,
      gameEscrow: gameEscrowPK,
      mint: mint,
      gameVault: gameVaultPK,
      treasury: treasury.publicKey,
      treasuryVault: treasuryTokenAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    console.log("\n🔄 Executing Batch 1 (batch_index=0)...");
    console.log("   Paying: User1");
    console.log("   Batch size: 1");

    await program.methods
      .resolveGameBatch(feePercentage, 0)
      .accounts(accounts)
      .remainingAccounts([
        { pubkey: bet1PK, isWritable: true, isSigner: false },
        { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
      ])
      .signers([adminKeypair])
      .rpc();

    // Check game state after Batch 1
    const gameAfterBatch1 = await program.account.game.fetch(gamePK);
    const bet1DataAfter = await program.account.bet.fetch(bet1PK);

    console.log("\n✅ Batch 1 Complete!");
    console.log("📊 Post-Batch 1 State:");
    console.log(
      `   Payout Progress: ${gameAfterBatch1.payoutProgress}/2 winners paid`
    );
    console.log(`   Game Status: ${JSON.stringify(gameAfterBatch1.status)}`);
    console.log(`   User1 Bet Paid Status: ${bet1DataAfter.paid}`);

    // Verify intermediate state
    expect(gameAfterBatch1.payoutProgress).to.equal(1); // 1 out of 2 winners paid
    expect(gameAfterBatch1.status).to.deep.equal({ resolving: {} });
    expect(bet1DataAfter.paid).to.be.true; // <-- Verify bet is marked paid

    // Verify User1 received payout
    const user1BalanceAfter = await connection.getTokenAccountBalance(
      user1TokenAccount
    );
    const user1Change = new BN(user1BalanceAfter.value.amount).sub(
      new BN(user1BalanceBefore.value.amount)
    );

    // Calculate expected payout
    const numberOfLosers = new BN(3);
    const numberOfWinners = new BN(2);
    const entryFee = new BN(entryFeeRaw);
    const losersPool = entryFee.mul(numberOfLosers);
    const feeFromLosers = losersPool
      .mul(new BN(feePercentage))
      .div(new BN(10000));
    const netLosersPool = losersPool.sub(feeFromLosers);
    const winningsPerWinner = netLosersPool.div(numberOfWinners);
    const totalPayoutPerWinner = entryFee.add(winningsPerWinner);

    console.log(`   User1 received: ${user1Change.toString()} tokens`);
    console.log(`   Expected: ${totalPayoutPerWinner.toString()} tokens`);

    expect(user1Change.toString()).to.equal(totalPayoutPerWinner.toString());

    // Verify treasury has NOT received fees yet
    const treasuryBalanceAfter = await connection.getTokenAccountBalance(
      treasuryTokenAccount
    );
    const treasuryChange = new BN(treasuryBalanceAfter.value.amount).sub(
      new BN(treasuryBalanceBefore.value.amount)
    );
    expect(treasuryChange.toNumber()).to.equal(0);
    console.log(`   Treasury received: 0 tokens (fees paid after all winners)`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ BATCH 1 VERIFICATION COMPLETE");
    console.log("=".repeat(60) + "\n");
  });

  it("🛡️ SECURITY TEST 1: Fails to re-run Batch 1 (batch_index=0)", async () => {
    console.log("\n" + "=".repeat(60));
    console.log(
      "🛡️ SECURITY TEST 1: Attempting to re-run Batch 1 (replay attack)..."
    );
    console.log("=".repeat(60));

    const gameDataBefore = await program.account.game.fetch(gamePK);
    const user1BalanceBefore = await connection.getTokenAccountBalance(
      user1TokenAccount
    );

    console.log(`\n📊 Pre-Attack State:`);
    console.log(`   Payout Progress: ${gameDataBefore.payoutProgress}`);
    console.log(`   User1 Balance: ${user1BalanceBefore.value.amount}`);
    console.log(`   Game Status: ${JSON.stringify(gameDataBefore.status)}`);

    expect(gameDataBefore.payoutProgress).to.equal(1); // Expect 1 winner paid

    const feePercentage = 500;
    const accounts = {
      admin: adminKeypair.publicKey,
      game: gamePK,
      gameEscrow: gameEscrowPK,
      mint: mint,
      gameVault: gameVaultPK,
      treasury: treasury.publicKey,
      treasuryVault: treasuryTokenAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    console.log("\n🔄 Executing Batch 1 (batch_index=0) AGAIN...");
    console.log("   Expected: This transaction MUST fail.");

    try {
      await program.methods
        .resolveGameBatch(feePercentage, 0) // batch_index = 0
        .accounts(accounts)
        .remainingAccounts([
          { pubkey: bet1PK, isWritable: true, isSigner: false },
          { pubkey: user1TokenAccount, isWritable: true, isSigner: false },
        ])
        .signers([adminKeypair])
        .rpc();

      expect.fail("Vulnerability detected: Re-running batch 0 succeeded.");
    } catch (error) {
      console.log("✅ PROTECTION 1 VERIFIED: Transaction failed as expected!");
      expect(error.toString()).to.include("InvalidBatchIndex");
      console.log(`   Error: ${error.message}`);
    }

    const user1BalanceAfter = await connection.getTokenAccountBalance(
      user1TokenAccount
    );
    expect(user1BalanceAfter.value.amount).to.equal(
      user1BalanceBefore.value.amount
    );
    console.log("\n📊 Post-Attack State (Verification):");
    console.log(
      `   User1 Balance: ${user1BalanceAfter.value.amount} (Unchanged)`
    );
  });

  it("🛡️ SECURITY TEST 2: Fails to pay User 1 AGAIN in Batch 2 (batch_index=1)", async () => {
    console.log("\n" + "=".repeat(60));
    console.log(
      "🛡️ SECURITY TEST 2: Attempting to pay User 1 in Batch 2's slot..."
    );
    console.log("=".repeat(60));

    const gameDataBefore = await program.account.game.fetch(gamePK);
    const user1BalanceBefore = await connection.getTokenAccountBalance(
      user1TokenAccount
    );

    console.log(`\n📊 Pre-Attack State:`);
    console.log(`   Payout Progress: ${gameDataBefore.payoutProgress}`); // Should be 1
    console.log(`   User1 Balance: ${user1BalanceBefore.value.amount}`);
    expect(gameDataBefore.payoutProgress).to.equal(1);

    const feePercentage = 500;
    const accounts = {
      admin: adminKeypair.publicKey,
      game: gamePK,
      gameEscrow: gameEscrowPK,
      mint: mint,
      gameVault: gameVaultPK,
      treasury: treasury.publicKey,
      treasuryVault: treasuryTokenAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    console.log(
      "\n🔄 Executing Batch 2 (batch_index=1) with USER 1's ACCOUNTS..."
    );
    console.log("   Expected: This transaction MUST fail.");

    try {
      await program.methods
        .resolveGameBatch(feePercentage, 1) // batch_index = 1 (valid index)
        .accounts(accounts)
        .remainingAccounts([
          { pubkey: bet1PK, isWritable: true, isSigner: false }, // User 1's Bet
          { pubkey: user1TokenAccount, isWritable: true, isSigner: false }, // User 1's ATA
        ])
        .signers([adminKeypair])
        .rpc();

      expect.fail(
        "Vulnerability detected: Paying User 1 in Batch 2 succeeded."
      );
    } catch (error) {
      console.log("✅ PROTECTION 2 VERIFIED: Transaction failed as expected!");
      expect(error.toString()).to.include("BetAlreadyPaid");
      console.log(`   Error: ${error.message}`);
    }

    const user1BalanceAfter = await connection.getTokenAccountBalance(
      user1TokenAccount
    );
    expect(user1BalanceAfter.value.amount).to.equal(
      user1BalanceBefore.value.amount
    );
    console.log("\n📊 Post-Attack State (Verification):");
    console.log(
      `   User1 Balance: ${user1BalanceAfter.value.amount} (Unchanged)`
    );

    // Also verify game state wasn't wrongly updated
    const gameDataAfter = await program.account.game.fetch(gamePK);
    expect(gameDataAfter.payoutProgress).to.equal(1); // Still 1
    console.log(
      `   Payout Progress: ${gameDataAfter.payoutProgress} (Unchanged)`
    );

    console.log("\n" + "=".repeat(60));
    console.log("🛡️ ALL SECURITY TESTS COMPLETE");
    console.log("=".repeat(60) + "\n");
  });

  it("🎯 BATCH 2: Resolve game - Pay second winner (User2) and finalize with batch_index=1", async () => {
    console.log("\n" + "=".repeat(60));
    console.log("🎯 BATCH RESOLUTION TEST - BATCH 2 of 2 (FINAL)");
    console.log("=".repeat(60));

    // Capture balances BEFORE Batch 2
    const user2BalanceBefore = await connection.getTokenAccountBalance(
      user2TokenAccount
    );
    const treasuryBalanceBefore = await connection.getTokenAccountBalance(
      treasuryTokenAccount
    );
    const bet2DataBefore = await program.account.bet.fetch(bet2PK);

    console.log("\n📊 Pre-Batch 2 State:");
    console.log(`   User2 Balance: ${user2BalanceBefore.value.amount}`);
    console.log(`   Treasury Balance: ${treasuryBalanceBefore.value.amount}`);
    console.log(`   User2 Bet Paid Status: ${bet2DataBefore.paid}`);
    expect(bet2DataBefore.paid).to.be.false;

    const gameBeforeBatch2 = await program.account.game.fetch(gamePK);
    console.log(
      `   Current Payout Progress: ${gameBeforeBatch2.payoutProgress}`
    );
    console.log(
      `   Current Status: ${JSON.stringify(gameBeforeBatch2.status)}`
    );

    // We expect payoutProgress to be 1 (ready for batch 1)
    expect(gameBeforeBatch2.payoutProgress).to.equal(1);

    const feePercentage = 500; // 5% fee
    const accounts = {
      admin: adminKeypair.publicKey,
      game: gamePK,
      gameEscrow: gameEscrowPK,
      mint: mint,
      gameVault: gameVaultPK,
      treasury: treasury.publicKey,
      treasuryVault: treasuryTokenAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    console.log("\n🔄 Executing Batch 2 (batch_index=1)...");
    console.log("   Paying: User2");
    console.log("   This batch will finalize the game!");

    // BATCH 2: Pay User2 (batch_index = 1)
    await program.methods
      .resolveGameBatch(feePercentage, 1) // batch_index = 1
      .accounts(accounts)
      .remainingAccounts([
        // --- THIS IS THE FIX ---
        { pubkey: bet2PK, isWritable: true, isSigner: false },
        { pubkey: user2TokenAccount, isWritable: true, isSigner: false },
        // --- END FIX ---
      ])
      .signers([adminKeypair])
      .rpc();

    // Check final game state
    const gameAfterBatch2 = await program.account.game.fetch(gamePK);
    const gameEscrowAfterBatch2 = await program.account.gameEscrow.fetch(
      gameEscrowPK
    );
    const bet2DataAfter = await program.account.bet.fetch(bet2PK);

    console.log("\n✅ Batch 2 Complete - GAME FULLY RESOLVED!");
    console.log("📊 Final Game State:");
    console.log(
      `   Payout Progress: ${gameAfterBatch2.payoutProgress}/2 winners paid`
    );
    console.log(`   Game Status: ${JSON.stringify(gameAfterBatch2.status)}`);
    console.log(`   Escrow Balance: ${gameEscrowAfterBatch2.totalAmount}`);
    console.log(`   User2 Bet Paid Status: ${bet2DataAfter.paid}`);

    // Verify final state
    expect(gameAfterBatch2.payoutProgress).to.equal(2); // All winners paid!
    expect(gameAfterBatch2.status).to.deep.equal({ resolved: {} });
    expect(gameEscrowAfterBatch2.totalAmount.toNumber()).to.equal(0);
    expect(bet2DataAfter.paid).to.be.true; // <-- Verify bet is marked paid

    // Calculate all expected amounts
    const numberOfLosers = new BN(3);
    const numberOfWinners = new BN(2);
    const entryFee = new BN(entryFeeRaw);
    const losersPool = entryFee.mul(numberOfLosers);
    const feeFromLosers = losersPool
      .mul(new BN(feePercentage))
      .div(new BN(10000));
    const netLosersPool = losersPool.sub(feeFromLosers);
    const winningsPerWinner = netLosersPool.div(numberOfWinners);
    const remainderToTreasury = netLosersPool.mod(numberOfWinners);
    const totalPayoutPerWinner = entryFee.add(winningsPerWinner);
    const expectedTreasuryAmount = feeFromLosers.add(remainderToTreasury);

    // Verify User2 received correct payout
    const user2BalanceAfter = await connection.getTokenAccountBalance(
      user2TokenAccount
    );
    const user2Change = new BN(user2BalanceAfter.value.amount).sub(
      new BN(user2BalanceBefore.value.amount)
    );

    console.log(`\n💰 User2 Payment:`);
    console.log(`   User2 received: ${user2Change.toString()} tokens`);
    console.log(`   Expected: ${totalPayoutPerWinner.toString()} tokens`);
    expect(user2Change.toString()).to.equal(totalPayoutPerWinner.toString());

    // Verify treasury received fees + remainder
    const treasuryBalanceAfter = await connection.getTokenAccountBalance(
      treasuryTokenAccount
    );
    const treasuryChange = new BN(treasuryBalanceAfter.value.amount).sub(
      new BN(treasuryBalanceBefore.value.amount)
    );

    console.log(`\n💰 Treasury Payment (Fees + Remainder):`);
    console.log(`   Losers pool: ${losersPool.toString()}`);
    console.log(`   Fee (5%): ${feeFromLosers.toString()}`);
    console.log(`   Remainder: ${remainderToTreasury.toString()}`);
    console.log(`   Total to treasury: ${expectedTreasuryAmount.toString()}`);
    console.log(`   Treasury received: ${treasuryChange.toString()}`);

    expect(treasuryChange.toString()).to.equal(
      expectedTreasuryAmount.toString()
    );

    console.log("\n" + "=".repeat(60));
    console.log("✅ BATCH 2 VERIFICATION COMPLETE");
    console.log("✅ ENTIRE GAME SUCCESSFULLY RESOLVED IN 2 BATCHES!");
    console.log("=".repeat(60));

    console.log("\n📈 FINAL SUMMARY:");
    console.log("   Total Players: 5");
    console.log("   Winners: 2 (User1, User2)");
    console.log("   Losers: 3 (User3, User4, User5)");
    console.log("   Resolution: 2 batches (batch_size=1 each)");
    console.log("   Fee: 5% = " + feeFromLosers.toString() + " tokens");
    console.log(
      "   Each winner received: " + totalPayoutPerWinner.toString() + " tokens"
    );
    console.log(
      "   Treasury received: " + expectedTreasuryAmount.toString() + " tokens"
    );
    console.log(
      "   Status transitions: Open → Resolving (after batch 1) → Resolved (after batch 2)"
    );
    console.log("");
  });
});
