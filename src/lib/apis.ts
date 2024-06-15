import { BASE_URL } from "@/config";
import { PoolStatus } from "@/utils/type";
import axios from "axios";

export const poolMiner = async (
  nftAddresses: string[],
  ownerAddress: string,
  signature: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/poolMiner`, {
      nftAddresses,
      ownerAddress,
      signature,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const withdrawMinerFromPool = async (
  nftAddresses: string[],
  ownerAddress: string,
  signature: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/withdrawMinerFromPool`, {
      nftAddresses,
      ownerAddress,
      signature,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const minerPoolStatus = async (
  nftAddresses: string[]
): Promise<PoolStatus[]> => {
  try {
    const response = await axios.post(`${BASE_URL}/minerPoolStatus`, {
      nftAddresses: nftAddresses,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const claimPoolRewards = async (ownerAddress: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/claimPoolRewards`, {
      ownerAddress,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
