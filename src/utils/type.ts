export type Nft = {
  mint: string;
  image: string;
  description: string;
  data: {
    creators: any[];
    name: string;
    symbol: string;
    uri: string;
  };
  staked: boolean;
  stakedAt: number;
  owner: string;
  status: string;
  lockTime: number;
  rate: number;
};

export type PoolStatus = {
  nftAddress: string;
  isPooled: boolean;
  status?: string;
  timestamp?: string;
};
