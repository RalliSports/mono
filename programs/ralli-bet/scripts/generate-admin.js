//GENERATING TEST ADMIN KEYPAIR FOR RALLI-BET
const fs = require("fs");
const { Keypair } = require("@solana/web3.js");

const kp = Keypair.generate();

// Save the secret key to a file so tests can load it later
fs.writeFileSync(
    "admin-keypair-new.json",
    JSON.stringify(Array.from(kp.secretKey))
);

console.log("Generated Admin Keypair");
console.log("Public Key:", kp.publicKey.toBase58());
