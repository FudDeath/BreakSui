import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import axios from "axios";

// Needed to simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

let tps = 0;
let latency = 0;

function getKeyPairFromExportedPrivateKey(privateKey) {
  let parsedKeyPair = decodeSuiPrivateKey(privateKey);
  return Ed25519Keypair.fromSecretKey(parsedKeyPair.secretKey);
}

const fetchTPS = async () => {
  try {
    console.log("Fetching TPS from API...");
    const apiKey = process.env.API_KEY;

    const response = await axios.get(
      "https://api.blockberry.one/sui/v1/total/values/tps?period=SEC",
      {
        headers: {
          accept: "*/*",
          "x-api-key": apiKey,
        },
      }
    );
    console.log("API Response:", response.data);
    tps = response.data;
  } catch (error) {
    console.error(
      "Error fetching TPS:",
      error.response ? error.response.data : error.message
    );
  }
};

const main = async () => {
  const SENDER_PRIVATE_KEY = process.env.ACC1_PRIVATE_KEY;
  const sender_keypair = getKeyPairFromExportedPrivateKey(SENDER_PRIVATE_KEY);
  const RECEIVER_PRIVATE_KEY =
    process.env.ACC2_PRIVATE_KEY || process.env.ACC1_PRIVATE_KEY;
  const receiver_keypair =
    getKeyPairFromExportedPrivateKey(RECEIVER_PRIVATE_KEY);
  const receiver_address = receiver_keypair.getPublicKey().toSuiAddress();
  let url = getFullnodeUrl("mainnet");
  if (process.env.URL) {
    url = process.env.URL;
  }
  const suiClient = new SuiClient({ url: url });
  const gasPrice = await suiClient.getReferenceGasPrice();

  while (true) {
    try {
      const txb = new TransactionBlock();
      const [coin] = txb.splitCoins(txb.gas, [txb.pure(1)]);
      txb.transferObjects([coin], receiver_address);
      txb.setSender(sender_keypair.toSuiAddress());
      txb.setGasBudget(5_000_000);
      txb.setGasPrice(gasPrice);

      const buildStartTime = performance.now();
      const bytes = await txb.build({ client: suiClient, limits: {} });

      const startTime = performance.now();
      await suiClient.signAndExecuteTransactionBlock({
        signer: sender_keypair,
        transactionBlock: bytes,
        options: { showEffects: true },
      });

      const endTime = performance.now();

      latency = (endTime - startTime) / 1000;

      console.log(`E2E latency for p2p transfer: ${latency} s`);
    } catch (error) {
      console.log("Error:", error.message);
    }
    await new Promise((resolve) =>
      setTimeout(resolve, process.env.PING_INTERVAL * 1000)
    );
  }
};

main();
setInterval(fetchTPS, 5000); // Fetch TPS every 30 seconds

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/metrics", (req, res) => {
  res.json({ tps, latency });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
