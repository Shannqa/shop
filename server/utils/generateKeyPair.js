import crypto from "crypto";
import fs from "fs";
import __dirname from "./dirname.js";

/* Generate RSA private and public key pair */
// !!! After running this app, move the files somewhere safe !!!

function genKeyPair() {
  // generate an object with private and public keys
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4056,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  // save the keys to separate files

  fs.writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);
  fs.writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);
}

genKeyPair();
