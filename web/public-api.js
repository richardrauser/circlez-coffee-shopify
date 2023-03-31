import { createHmac } from "crypto";
import cors from "cors";
import Web3 from "web3";

import { getContractAddressesFromGate } from "./api/gates.js";

const web3 = new Web3();

export function configurePublicApi(app) {
  // This should be limited to app domains that have your app installed
  const corsOptions = {
    origin: "*",
  };

  // Configure CORS to allow requests to /public from any origin
  // Enables pre-flight requests
  app.options("/public/*", cors(corsOptions));

  app.post("/public/gateEvaluation", cors(corsOptions), async (req, res) => {
    // Evaluate the gate, message, and signature
    const { shopDomain, productGid, address, message, signature, gateConfigurationGid } = req.body;

    console.log("CCDEBUG: VERIFYING SIGNATURE..");
    // Verify signature
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    if (recoveredAddress !== address) {
      res.status(403).send("Invalid signature");
      return;
    }

    console.log("CCDEBUG: VERIFIED SIGNATURE..");

    // Retrieve relevant contract addresses from gates
    const requiredContractAddresses = await getContractAddressesFromGate({shopDomain, productGid});

    console.log("required contract address: " + requiredContractAddresses);

    // Lookup tokens
    const unlockingTokens = await retrieveUnlockingTokens(
      address,
      requiredContractAddresses
    );

    console.log("UNLOCKING TOKENS: " + JSON.stringify(unlockingTokens));
    if (unlockingTokens.length === 0) {
      res.status(403).send("No unlocking tokens");
      return;
    }

    const payload = {
      id: gateConfigurationGid
    };

    const response = {gateContext: [getHmac(payload)], unlockingTokens};
    res.status(200).send(response);
  });
}

function getHmac(payload) {
  const hmacMessage = payload.id;
  const hmac = createHmac("sha256", "secret-key");
  hmac.update(hmacMessage);
  const hmacDigest = hmac.digest("hex");
  return {
    id: payload.id,
    hmac: hmacDigest,
  };
}

function retrieveUnlockingTokens(address, contractAddresses) {
  // This could be a lookup against a node or a 3rd party service like Alchemy
  console.log("address: " + address);
  console.log("contract address: " + contractAddresses);
  
  return Promise.resolve([
    {
      name: "CryptoSkull",
      imageUrl:
        "https://i.seadn.io/gcs/files/00fd38006a28bf334a4f63dd97aacdf8.png",
      collectionName: "CryptoSkulls",
      collectionAddress: "0xc1Caf0C19A8AC28c41Fe59bA6c754e4b9bd54dE9",
    },
  ]);
}
