import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { SAKUWALLT, SOLANA_RPC } from "@/config";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";

export const solConnection = new Connection(SOLANA_RPC);

export const getDelegateStatus = async (mint: string, signer: PublicKey) => {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      new PublicKey(mint),
      signer
    );
    const tokenAccountData = await solConnection.getParsedAccountInfo(
      tokenAccount
    );

    const parsedInfo = tokenAccountData.value?.data as ParsedAccountData;
    const delegateAddress = parsedInfo.parsed?.info.delegate;
    const delegateAmount = parsedInfo.parsed?.info.delegatedAmount;

    if (delegateAddress === SAKUWALLT && delegateAmount !== 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching delegate status:", error);
    return false; // Return false in case of any error
  }
};

export const getFrozonStatus = async (mint: string, signer: PublicKey) => {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      new PublicKey(mint),
      signer
    );
    const tokenAccountData = await solConnection.getParsedAccountInfo(
      tokenAccount
    );

    const parsedInfo = tokenAccountData.value?.data as ParsedAccountData;
    const delegateAddress = parsedInfo.parsed?.info.delegate;
    console.log("parsedInfo.parsed.info.state", parsedInfo.parsed.info.state);
    if (
      delegateAddress === SAKUWALLT &&
      parsedInfo.parsed.info.state === "frozen"
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching delegate status:", error);
    return false; // Return false in case of any error
  }
};

export const getNftMetadata = async (mint: PublicKey) => {
  const metaplex = new Metaplex(solConnection);
  // metaplex.use();
  // metaplex.use(walletAdapterIdentity(wallet));
  const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
  return nft;
};

export const shortenPublicKey = (publicKey: string | undefined) => {
  return `${publicKey?.slice(0, 4)}...${publicKey?.slice(-4)}`;
};
