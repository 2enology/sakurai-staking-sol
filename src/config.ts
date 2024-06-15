import { web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
export const SOL_PRICE_API =
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const REWARD_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_TOKEN_MINT ??
    "Gjkb34x271Rbww1vyxCPuS8PDgXBrdRaTdNiwi6eDAqc"
);

export const METAPLEX = new web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const USER_POOL_SIZE = 3264;
export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const PROGRAM_ID = "EiSfqCjdSwDez1ihbkatyfkvP5TVZ1JCekVYwvg1r6Gr";

export const SOLANA_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC ??
  "https://devnet.helius-rpc.com/?api-key=4401b929-7687-43b5-ab0b-77a34de621e9";

export const CREATOR_ADDRESS =
  process.env.NEXT_PUBLIC_CREATOR_ADDRESS ??
  "Ctci2VuJgHPo8d1e3BKGFkFfYafQfyRNvyt6ksXCKV4Z";

export const MAX_SELECTABLE = 999;

export const SAKUWALLT = "";

export const DAY = 15;

export enum PLANS {
  PLAN_0 = 7,
  PLAN_1 = 15,
  PLAN_2 = 30,
}
