import * as anchor from "@coral-xyz/anchor";
import { solConnection } from "@/utils/util";
import type { NextApiRequest, NextApiResponse } from "next";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Transaction } from "@solana/web3.js";

type Data = {
  status: string;
  tx?: string;
  error?: any;
};

const adminKeypair = anchor.web3.Keypair.fromSecretKey(
  bs58.decode(process.env.ADMIN_WALLET as string)
);
const adminWallet = new NodeWallet(adminKeypair);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { txData } = req.body;
    console.log("---------------------------");
    console.log({ txData });
    console.log("---------------------------");
    let tx = Transaction.from(Buffer.from(txData, 'base64'));

    // Sign the transaction with admin's Keypair
    tx = await adminWallet.signTransaction(tx);
    console.log("signed admin: ", adminWallet.publicKey.toBase58());

    const sTx = tx.serialize();

    // Send the raw transaction
    const options = {
      commitment: "confirmed",
      skipPreflight: false,
    };
    // Confirm the transaction
    const signature = await solConnection.sendRawTransaction(sTx, options);
    await solConnection.confirmTransaction(signature, "confirmed");

    console.log("Transaction confirmed:", signature);
    res.status(200).json({ status: "Confirmed", tx: signature });
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ status: "Failed", error: error });
  }
}
