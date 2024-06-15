import * as anchor from "@coral-xyz/anchor";
import { GLOBAL_AUTHORITY_SEED, PROGRAM_ID } from "../lib/constant";
import { PublicKey } from "@solana/web3.js";

import {
  createInitUserTx,
  createLockPnftTx,
  createUnlockPnftTx,
} from "../lib/scripts";
import { GlobalPool, UserPool } from "../lib/types";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { solConnection } from "@/utils/util";
import { IDL } from "./staking";
import { REWARD_TOKEN_MINT } from "@/config";
import {
  getATokenAccountsNeedCreate,
  getAssociatedTokenAccount,
} from "../lib/util";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Address of the deployed program.
const programId = new anchor.web3.PublicKey(PROGRAM_ID);

const cloneWindow: any = window;
const provider = new anchor.AnchorProvider(
  solConnection,
  cloneWindow["solana"],
  anchor.AnchorProvider.defaultOptions()
);

const program = new anchor.Program(IDL as anchor.Idl, programId, provider);
/**
 * Initialize user pool
 */
export const initializeUserPool = async (wallet: WalletContextState) => {
  if (wallet.publicKey === null) return;
  try {
    const tx = await createInitUserTx(wallet.publicKey, program);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: "confirmed",
    });

    console.log("txHash: ", txId);
  } catch (e) {
    console.log(e);
  }
};

export const lockPnft = async (
  wallet: WalletContextState,
  nftMints: PublicKey[]
) => {
  if (!wallet.publicKey) return;
  try {
    const tx = await createLockPnftTx(wallet, nftMints, program);
    if (tx) {
      console.log({ tx });
    }
  } catch (e) {
    console.log(e);
  }
};

export const unlockPnft = async (
  wallet: WalletContextState,
  nftMints: PublicKey[]
) => {
  if (wallet.publicKey === null) return;
  try {
    const tx = await createUnlockPnftTx(
      wallet,
      nftMints,
      program,
      solConnection
    );
  } catch (e) {
    console.log(e);
  }
};

export const getGlobalState = async (): Promise<GlobalPool | null> => {
  const [globalPool, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  try {
    let globalState = await program.account.globalPool.fetch(globalPool);
    return globalState as unknown as GlobalPool;
  } catch {
    return null;
  }
};

export const getGlobalInfo = async () => {
  const globalPool: GlobalPool | null = await getGlobalState();
  if (globalPool === null) {
    return null;
  }
  return globalPool.admin.toBase58();
};

export const getUserState = async (
  user: PublicKey
): Promise<UserPool | null> => {
  let userPoolKey = await PublicKey.createWithSeed(
    user,
    "user-pool",
    program.programId
  );
  try {
    let userState = await program.account.userPool.fetch(userPoolKey);
    return userState as unknown as UserPool;
  } catch {
    return null;
  }
};

export const claimRewardTx = async (wallet: WalletContextState) => {
  if (!wallet.publicKey) return;
  const userAddress = wallet.publicKey;

  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    program.programId
  );

  console.log("globalAuthority =", globalAuthority.toBase58());

  let userPoolKey = await PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    program.programId
  );

  let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
    userAddress,
    userAddress,
    [REWARD_TOKEN_MINT]
  );

  const rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    REWARD_TOKEN_MINT
  );

  const tx = await program.methods
    .claimReward()
    .accounts({
      owner: userAddress,
      userPool: userPoolKey,
      globalAuthority,
      rewardVault,
      userRewardAccount: destinationAccounts[0],
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .preInstructions([...instructions])
    .transaction();

  tx.feePayer = userAddress;
  tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;

  if (wallet.signTransaction) {
    const txData = await wallet.signTransaction(tx);
    const sTx = txData.serialize();

    const txId = await solConnection.sendRawTransaction(sTx);

    const finalized = await solConnection.confirmTransaction(txId, "finalized");

    console.log({ txId });
    return txId;
  }
};
