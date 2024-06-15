import * as anchor from "@coral-xyz/anchor";
import {
  PublicKey,
  Connection,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PROGRAM_ID as TOKEN_AUTH_RULES_ID } from "@metaplex-foundation/mpl-token-auth-rules";

import {
  METAPLEX,
  MPL_DEFAULT_RULE_SET,
  findTokenRecordPda,
  getATokenAccountsNeedCreate,
  getAssociatedTokenAccount,
  getMasterEdition,
  getMetadata,
} from "./util";
import {
  ADMIN_ADDRESS,
  GLOBAL_AUTHORITY_SEED,
  REWARD_TOKEN_MINT,
  USER_POOL_SIZE,
} from "./constant";
import { solConnection } from "@/utils/util";
import { WalletContextState } from "@solana/wallet-adapter-react";

export const createInitUserTx = async (
  userAddress: PublicKey,
  program: anchor.Program
) => {
  let userPoolKey = await PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    program.programId
  );

  console.log("userPool: ", userPoolKey.toBase58());

  let ix = SystemProgram.createAccountWithSeed({
    fromPubkey: userAddress,
    basePubkey: userAddress,
    seed: "user-pool",
    newAccountPubkey: userPoolKey,
    lamports: await solConnection.getMinimumBalanceForRentExemption(
      USER_POOL_SIZE
    ),
    space: USER_POOL_SIZE,
    programId: program.programId,
  });

  const txId = await program.methods
    .initUser()
    .accounts({
      user: userAddress,
      userPool: userPoolKey,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .preInstructions([ix])
    .transaction();

  return txId;
};

export const createLockPnftTx = async (
  wallet: WalletContextState,
  nftMints: PublicKey[],
  program: anchor.Program
) => {
  const userAddress = wallet.publicKey;
  if (userAddress === null) return;

  const tx = new Transaction();

  for (const nftMint of nftMints) {
    const [globalPool, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );
    console.log("globalPool: ", globalPool.toBase58());

    let userPoolKey = await PublicKey.createWithSeed(
      userAddress,
      "user-pool",
      program.programId
    );
    console.log("userPool: ", userPoolKey.toBase58());

    const nftEdition = await getMasterEdition(nftMint);
    console.log("nftEdition: ", nftEdition.toBase58());

    let tokenAccount = await getAssociatedTokenAccount(userAddress, nftMint);
    console.log("tokenAccount: ", tokenAccount.toBase58());

    const mintMetadata = await getMetadata(nftMint);
    console.log("mintMetadata: ", mintMetadata.toBase58());

    const tokenMintRecord = findTokenRecordPda(nftMint, tokenAccount);
    console.log("tokenMintRecord: ", tokenMintRecord.toBase58());

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    console.log({ poolAccount });
    if (poolAccount === null || poolAccount.data === null) {
      console.log("init User Pool");
      const tx_initUserPool = await createInitUserTx(userAddress, program);
      console.log({ tx_initUserPool });
      tx.add(tx_initUserPool);
    }

    console.log("admin address: ", ADMIN_ADDRESS.toBase58());

    const txId = await program.methods
      .lockPnft(new anchor.BN(10))
      .accounts({
        globalPool,
        tokenAccount,
        tokenMint: nftMint,
        tokenMintEdition: nftEdition,
        tokenMintRecord,
        mintMetadata,
        authRules: MPL_DEFAULT_RULE_SET,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        signer: userAddress,
        userPool: userPoolKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METAPLEX,
        authRulesProgram: TOKEN_AUTH_RULES_ID,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    tx.add(txId);
  }

  tx.feePayer = userAddress;
  tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;

  if (wallet.signTransaction) {
    const txData = await wallet.signTransaction(tx);
    console.log("=====", await solConnection.simulateTransaction(txData));

    const sTx = txData.serialize();

    const txId = await solConnection.sendRawTransaction(sTx);

    const finalized = await solConnection.confirmTransaction(txId, "finalized");

    console.log({ txId });
    return txId;
  }
};

export const claimRewardTx = async (
  wallet: WalletContextState,
  program: anchor.Program
) => {
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

export const createUnlockPnftTx = async (
  wallet: WalletContextState,
  nftMints: PublicKey[],
  program: anchor.Program,
  connection: Connection
) => {
  const userAddress = wallet.publicKey;
  if (userAddress === null) return;

  const tx = new Transaction();

  for (const nftMint of nftMints) {
    const [globalPool, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_AUTHORITY_SEED)],
      program.programId
    );
    console.log("globalPool: ", globalPool.toBase58());

    let userPoolKey = await PublicKey.createWithSeed(
      userAddress,
      "user-pool",
      program.programId
    );
    console.log("userPool: ", userPoolKey.toBase58());

    const nftEdition = await getMasterEdition(nftMint);
    console.log("nftEdition: ", nftEdition.toBase58());

    let tokenAccount = await getAssociatedTokenAccount(userAddress, nftMint);
    console.log("tokenAccount: ", tokenAccount.toBase58());

    const mintMetadata = await getMetadata(nftMint);
    console.log("mintMetadata: ", mintMetadata.toBase58());

    const tokenMintRecord = findTokenRecordPda(nftMint, tokenAccount);
    console.log("tokenMintRecord: ", tokenMintRecord.toBase58());

    const tx = new Transaction();

    const txId = await program.methods
      .unlockPnft()
      .accounts({
        admin: ADMIN_ADDRESS,
        globalPool,
        tokenAccount,
        tokenMint: nftMint,
        tokenMintEdition: nftEdition,
        tokenMintRecord,
        mintMetadata,
        authRules: MPL_DEFAULT_RULE_SET,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        signer: userAddress,
        userPool: userPoolKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METAPLEX,
        authRulesProgram: TOKEN_AUTH_RULES_ID,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    tx.add(txId);
  }

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
