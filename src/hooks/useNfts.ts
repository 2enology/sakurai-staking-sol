/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { Nft } from "@/utils/type";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { CREATOR_ADDRESS } from "@/config";
import { solConnection } from "@/utils/util";
import { getUserState } from "@/transaction/cli/txScripts";

const useNfts = (address: PublicKey | null, connected?: boolean) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const publicKey = address?.toBase58();

  const fetchNfts = async () => {
    setLoading(true);
    try {
      // Fetch the NFT accounts for the given address
      const nftAccounts = await getParsedNftAccountsByOwner({
        publicAddress: publicKey ?? "",
        connection: solConnection,
      });

      // If there are no NFT accounts, return an empty array
      if (!nftAccounts || nftAccounts.length === 0) {
        setLoading(false);
        return;
      }

      // Prepare an array to hold the full NFT data
      let fullData: Nft[] = [];

      let filtered: Nft[] = [];

      // Fetch metadata for each NFT concurrently
      await Promise.all(
        nftAccounts.map(async (account) => {
          console.log("account =====>", account)
          // Check if the NFT is verified and the creator address matches the specified address
          const creatorMatch = account.data?.creators?.find(
            (creator) =>
              creator.verified === 1 && creator.address === "Ctci2VuJgHPo8d1e3BKGFkFfYafQfyRNvyt6ksXCKV4Z"
          );
          console.log("creatorMatch =====>", creatorMatch)

          // If the creator match is not found, skip this NFT
          if (!creatorMatch) {
            return;
          }

          // Fetch metadata from the URI
          const metadataRes = await fetch(account.data.uri);
          if (!metadataRes.ok) {
            throw new Error("Failed to fetch metadata from uri");
          }

          // Parse the metadata JSON
          const metadata = await metadataRes.json();

          // Construct the NFT object
          const nft: Nft = {
            mint: account.mint,
            image: metadata.image,
            description: metadata.description,
            data: account.data,
            staked: false,
            stakedAt: 0,
            status: "",
            owner: publicKey ?? "",
            lockTime: -1,
            rate: -1,
          };
          console.log("nft===============>", nft)
          // Add the NFT to the full data array
          fullData.push(nft);
        })
      );

      if (address) {
        const stakedData = await getUserState(address);
        if (stakedData) {
          const { itemCount, items } = stakedData;
          const sMints: {
            mint: string;
            stakeTime: number;
            lockTime: number;
            rate: number;
          }[] = [];
          for (let i = 0; i < itemCount.toNumber(); i++) {
            sMints.push({
              mint: items[i].nftAddr.toBase58(),
              stakeTime: items[i].stakeTime.toNumber() * 1000,
              lockTime: items[i].lockTime.toNumber(),
              rate: items[i].rate.toNumber(),
            });
          }

          filtered = fullData.map((nft) => {
            const matchedNft = sMints.find((item) => item.mint === nft.mint);
            return {
              ...nft,
              lockTime: !matchedNft ? nft.lockTime : matchedNft.lockTime,
              rate: !matchedNft ? nft.rate : matchedNft.rate,
              stakedAt: !matchedNft ? nft.stakedAt : matchedNft.stakeTime,
              staked: matchedNft !== undefined,
            };
          });
        } else {
          filtered = fullData
        }
      }

      console.log("filtered", filtered)
      setNfts(filtered);
      setLoading(false);

    } catch (error: any) {
      // Log any errors that occur during the process
      console.log(error);
      setLoading(false);
      setError(error);
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (publicKey && connected) {
        await fetchNfts();
      } else {
        setNfts([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [address, connected, publicKey]);

  return { nfts, error, loading, fetchNfts };
};

export default useNfts;

const DEMODATA = [
  {
    mint: "string",
    image: "/images/nfts/1.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac eros est. Curabitur rhoncus ligula quis turpis tincidunt, eget dapibus arcu ultricies. Pellentesque sed metus ac magna viverra imperdiet.",
    data: {
      creators: [""],
      name: "Sakurai #1",
      symbol: "string",
      uri: "string",
    },
    staked: false,
    stakedAt: new Date().getTime(),
    owner: "string",
    status: "string",
  },
  {
    mint: "string",
    image: "/images/nfts/2.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac eros est. Curabitur rhoncus ligula quis turpis tincidunt, eget dapibus arcu ultricies. Pellentesque sed metus ac magna viverra imperdiet.",
    data: {
      creators: [""],
      name: "Sakurai #2",
      symbol: "string",
      uri: "string",
    },
    staked: false,
    stakedAt: new Date().getTime(),
    owner: "string",
    status: "string",
  },
  {
    mint: "string",
    image: "/images/nfts/3.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac eros est. Curabitur rhoncus ligula quis turpis tincidunt, eget dapibus arcu ultricies. Pellentesque sed metus ac magna viverra imperdiet.",
    data: {
      creators: [""],
      name: "Sakurai #3",
      symbol: "string",
      uri: "string",
    },
    staked: false,
    stakedAt: new Date().getTime(),
    owner: "string",
    status: "string",
  },
  {
    mint: "string",
    image: "/images/nfts/4.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac eros est. Curabitur rhoncus ligula quis turpis tincidunt, eget dapibus arcu ultricies. Pellentesque sed metus ac magna viverra imperdiet.",
    data: {
      creators: [""],
      name: "Sakurai #4",
      symbol: "string",
      uri: "string",
    },
    staked: false,
    stakedAt: new Date().getTime(),
    owner: "string",
    status: "string",
  },
];
