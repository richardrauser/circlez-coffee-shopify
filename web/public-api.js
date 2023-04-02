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

async function retrieveUnlockingTokens(address, contractAddress) {
  // This could be a lookup against a node or a 3rd party service like Alchemy
  console.log("address: " + address);
  console.log("contract address: " + contractAddress);

  var name;
  var image;
  var collectionName;


  if (contractAddress == "0x03E38414bb20ecA7A23AFBa8Ab42374c0d4b31F1") {
    const response = await fetch(`https://circlez-coffee.richardrauser.repl.co/api/member/0xBC10a3aE909B1b94f4C3E39607aD19D386dCe32a`, {
      method: "GET",
    });
    const json = await response.json();
  
    const id = json.metadata.id ? "#" + json.metadata.id : "";
    name = "Circlez Coffee Member " + id;
    image = json.metadata.image ?? "https://circlez-coffee.richardrauser.repl.co/CirclezCoffeeMembershipMainLogo.png";
    collectionName = "Circlez Coffee Membership";
  } else if (contractAddress == "0x22B3b03Be23086d7C717f4f6A9DA49BaC8849c62") {
    name = "First Purchase Completed";
    image = "https://circlez-coffee.richardrauser.repl.co/CirclezCoffeeFirstPurchase.png";
    collectionName = "First Purchase";
  }


  console.log("ID: " + image);
  console.log("IMAGE: " + image);
  
  return Promise.resolve([
    {
      name: name,
      imageUrl: image,
      collectionName: collectionName,
      collectionAddress: address,
    },
  ]);
}
