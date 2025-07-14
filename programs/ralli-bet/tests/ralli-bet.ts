import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RalliBet } from "../target/types/ralli_bet";
import BN from "bn.js";
import * as fs from "fs";
import * as path from "path";
import { Connection, PublicKey, SystemProgram , Keypair} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const keypairPath = path.resolve(process.env.HOME!, ".config/solana/id.json");

const secretKey = Uint8Array.from(
  JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
);

const keypair = Keypair.fromSecretKey(secretKey);

const wallet = new anchor.Wallet(keypair);

const provider = new anchor.AnchorProvider(
  new anchor.web3.Connection("https://api.devnet.solana.com", "confirmed"),
  wallet,
  { commitment: "confirmed" }
);

anchor.setProvider(provider);

const program = anchor.workspace.RalliBet as Program<RalliBet>;

let game: PublicKey;
let gameEscrow: PublicKey;

const gameId = new BN(3);

const userKeypair = Keypair.generate();
const userWallet = new anchor.Wallet(userKeypair);

before(async () => {
 [game] = PublicKey.findProgramAddressSync(
      [Buffer.from("game"), gameId.toArrayLike(Buffer, "le", 8)],
      program.programId
  );

  [gameEscrow] = PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), game.toBuffer()],
    program.programId
  );

  const signature = await connection.requestAirdrop(userKeypair.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
  await connection.confirmTransaction(signature);
})

describe("ralli-bet", () => {
  it("Create Game", async () => {
    const maxPlayers = 10;
    const entryFee = new BN(1000000); // 0.001 SOL in lamports

    const tx = await program.methods
      .createGame(gameId, maxPlayers, entryFee)
      .accountsPartial({
        creator: provider.wallet.publicKey,
        game: game,
        gameEscrow: gameEscrow,
        systemProgram: SystemProgram.programId,
      }).signers([keypair]).rpc();

    console.log(`transaction Signature: ${tx}`);

    // Verify the game account was created correctly
    const gameAccount = await program.account.game.fetch(game);
    console.log("Game Account:", gameAccount);
    
    // Verify the game escrow account was created correctly
    const gameEscrowAccount = await program.account.gameEscrow.fetch(gameEscrow);
    console.log("Game Escrow Account:", gameEscrowAccount);
  });

  it("Join Game", async () => {
    const tx = await program.methods.joinGame().accountsPartial({
      player: userWallet.publicKey,
      game: game,
      gameEscrow: gameEscrow,
      systemProgram: SystemProgram.programId,
    }).signers([userWallet.payer]).rpc();

    console.log(`Join Game Transaction Signature: ${tx}`);

    const gameAccount = await program.account.game.fetch(game);
    console.log("Game Account after join:", gameAccount);
    
    const gameEscrowAccount = await program.account.gameEscrow.fetch(gameEscrow);
    console.log("Game Escrow Account after join:", gameEscrowAccount);
  })
});