/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { DAY, MAX_SELECTABLE, PLANS } from "@/config";
import { useModal } from "@/contexts/ModalProvider";
import useNfts from "@/hooks/useNfts";
import { Nft } from "@/utils/type";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StakeModal from "./StakeModal";
import Header from "./Header";
import NftCard from "./NftCard";
import {
  claimRewardTx,
  getUserState,
  unlockPnft,
} from "@/transaction/cli/txScripts";
import ClaimButton from "./ClaimButton";

export default function MainPage() {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;

  const [totalStaked, setTotalStaked] = useState(0);

  const { openModal } = useModal();

  const { nfts, loading, fetchNfts } = useNfts(publicKey);
  const [tab, setTab] = useState<"all" | "staked" | "unstaked">("unstaked");
  const [selected, setSelected] = useState<Nft[]>([]);

  const [claimAbleTokens, setClaimAbleTokens] = useState(0);

  const [claiming, setClaiming] = useState(false);

  const stakedNfts = nfts.filter((nft) => nft.staked);
  const unStakedNfts = nfts.filter((nft) => !nft.staked);
  console.log("nftdddd =->", nfts);
  console.log("unStakedNfts =->", unStakedNfts);

  const handleSelect = (nft: Nft) => {
    let sel = [...selected];
    const index = sel.findIndex((s) => s.mint === nft.mint);

    const isLocked =
      (new Date().getTime() / 1000 - nft.lockTime) / DAY <
      PLANS[`PLAN_${nft.rate / 100_000_000 - 1}` as keyof typeof PLANS];

    if (!nft.staked) {
      if (isLocked) {
        toast.error("Locked!");
        return;
      }
    }
    if (!isLocked) {
      if (index !== -1 || sel.length === MAX_SELECTABLE) {
        // If the NFT is already selected, remove it
        sel.splice(index, 1);
      } else {
        // If the NFT is not selected, add it to the selection
        sel.push(nft);
      }
    }
    setSelected(sel);
  };

  useEffect(() => {
    setSelected([]);
  }, [tab]);

  const openStake = () => {
    openModal(<StakeModal nfts={selected} />);
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await claimRewardTx(wallet);

      await fetchNfts();
      toast.success("Claiming success");
      await fetchData();
    } catch (error) {
      console.log(error);
    }
    setClaiming(false);
  };

  const [unstaking, setUnstaking] = useState(false);

  const handleUnStake = async () => {
    setUnstaking(true);
    try {
      const res = await unlockPnft(
        wallet,
        selected.map((item) => new PublicKey(item.mint))
      );
      toast.success("NFT withdrawal success");
      await fetchNfts();
    } catch (error) {
      console.log(error);
    }
    setUnstaking(false);
  };

  const fetchData = async () => {
    if (wallet.publicKey) {
      const uData = await getUserState(wallet.publicKey);
      if (uData) {
        let sum = 0;
        for (let i = 0; i < uData.itemCount.toNumber(); i++) {
          const rate = uData.items[i].rate.toNumber();
          const range =
            (new Date().getTime() / 1000 -
              uData.items[i].rewardTime.toNumber()) /
            DAY;

          sum += rate * range;
        }
        setClaimAbleTokens(sum / LAMPORTS_PER_SOL);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 20_000); // 20 seconds
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [wallet.publicKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchNfts();
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    fetchData();
  }, [publicKey]);
  return (
    <>
      <div className="max-w-[calc(100%-24px)] md:max-w-[calc(100%-32px)] xl:max-w-[1080px] mx-4 xl:mx-auto pb-20">
        <Header staked={totalStaked} />
        {/* <div className="w-full h-[180px] lg:h-[280px] relative z-10">
          <Image src="/images/bg-2.jpg" fill className="object-cover" alt="" />
        </div> */}
        <section className="relative z-30 mt-10">
          {wallet.publicKey && (
            <div className="flex items-center justify-between gap-4 border-b border-dashed pb-2 border-white/30">
              <p className="text-white/80 uppercase text-sm md:text-lg">
                Claim Able Tokens:{" "}
                <span className="font-medium text-sm md:text-xl text-white/100">
                  $PEP{" "}
                  <span className="text-yellow-500">
                    {claimAbleTokens.toLocaleString()}
                  </span>
                </span>
              </p>
              <ClaimButton loading={claiming} claim={handleClaim} />
            </div>
          )}

          {!(connected && publicKey) ? (
            <div className="flex items-center justify-center">
              <div className="text-white text-center px-20 py-6 mt-20 text-md bg-slate-500/40 mx-auto rounded-lg">
                Note: Please connect your wallet
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-20">
                  {Array.from({ length: 5 }).map((_, key) => (
                    <div
                      className="animate-pulse bg-slate-600 aspect-square rounded-md"
                      key={key}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {nfts.length !== 0 ? (
                    <div className="pt-10 relative z-30">
                      <div className="relative z-30">
                        <div className="w-full border-b-2 border-white/10">
                          <div className="translate-y-0.5">
                            <button
                              className={`px-3 md:px-10 py-2 font-medium border-2 text-white border-none w-1/2 md:w-auto text-sm md:text-[16px] ${
                                tab === "unstaked" ? "tab-active" : ""
                              }`}
                              onClick={() => setTab("unstaked")}
                            >
                              {`Unstaked (${
                                nfts.filter((nft) => !nft.staked).length
                              })`}
                            </button>
                            <button
                              className={`px-3 md:px-10 py-2 font-medium border-2 text-white border-none w-1/2 md:w-auto text-sm md:text-[16px] ${
                                tab === "staked" ? "tab-active" : ""
                              }`}
                              onClick={() => setTab("staked")}
                            >
                              {`Staked (${
                                nfts.filter((nft) => nft.staked).length
                              })`}
                            </button>
                          </div>
                        </div>
                      </div>
                      {selected.length !== 0 && (
                        <div className="mt-10 flex items-center justify-between">
                          <p className="text-white/80 font-medium">{`${selected.length} NFT(s) selected`}</p>
                          <div className="flex items-center gap-2 md:mt-0">
                            <button
                              className="px-5 border font-medium rounded-lg bg-white/15 hover:bg-white/10 duration-200 disabled:opacity-70 border-white/20 disabled:pointer-events-none text-white md:w-[200px] grid place-content-center h-8 md:h-10 text-xs md:text-sm"
                              disabled={selected.length === 0}
                              onClick={() => setSelected([])}
                            >
                              Deselect All
                            </button>
                            {tab === "staked" ? (
                              <div className="text-white">
                                <button
                                  className="px-5 border font-medium rounded-lg bg-[#e14735] hover:bg-[#e14700] duration-200 disabled:opacity-70 border-white/20 disabled:pointer-events-none text-white md:w-[200px] grid place-content-center h-8 md:h-10 text-xs md:text-sm"
                                  disabled={selected.length === 0 || unstaking}
                                  onClick={handleUnStake}
                                >
                                  {unstaking ? "Unstaking..." : "Unstake"}
                                </button>
                              </div>
                            ) : (
                              <div className="text-white">
                                <button
                                  className="px-5 border font-medium rounded-lg bg-[#e14735] hover:bg-[#e14700] duration-200 disabled:opacity-70 border-white/20 disabled:pointer-events-none text-white md:w-[200px] grid place-content-center h-8 md:h-10 text-xs md:text-sm"
                                  disabled={selected.length === 0}
                                  onClick={openStake}
                                >
                                  stake
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                        {tab === "staked" &&
                          stakedNfts.map((nft, index) => (
                            <NftCard
                              key={`${index}-${nft.mint}`}
                              nft={nft}
                              refetch={async () => await fetchNfts()}
                              selected={selected}
                              select={() => handleSelect(nft)}
                            />
                          ))}
                        {tab === "unstaked" &&
                          unStakedNfts.map((nft, index) => (
                            <NftCard
                              key={`${index}-${nft.mint}`}
                              nft={nft}
                              refetch={async () => await fetchNfts()}
                              selected={selected}
                              select={() => handleSelect(nft)}
                            />
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-white text-center px-20 py-6 mt-20 text-2xl bg-purple-700/20 rounded-lg max-w-[720px] mx-auto">
                      You don&#39;t have any{" "}
                      <span className="font-bold">Sakurai</span> <br />
                      <div className="text-lg mt-3 flex items-center gap-2 justify-center">
                        Buy Sakurai on
                        <div className="flex items-center gap-1">
                          <Link href="https://magiceden.io/marketplace/sakurai">
                            <Image
                              src="/icons/magiceden.svg"
                              width={24}
                              height={24}
                              alt=""
                            />
                          </Link>
                          <Link href="https://www.tensor.trade/trade/sakurai">
                            <Image
                              src="/icons/tensor.svg"
                              width={24}
                              height={24}
                              alt=""
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
