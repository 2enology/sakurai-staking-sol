"use client";

import { Nft } from "@/utils/type";
import Image from "next/image";
import { Dispatch, FC, SetStateAction } from "react";

export const Background = () => {
  return (
    <div className="bg-[#181818] w-full h-full absolute left-0 top-0 pointer-events-none opacity-20">
      <Image
        src="/images/bg-2.jpg"
        fill
        className="object-cover blur-md"
        alt=""
      />
    </div>
  );
};

interface TabsProps {
  nfts: Nft[];
  tab: "staked" | "unstaked" | "all";
  setTab: Dispatch<SetStateAction<"staked" | "unstaked" | "all">>;
}

export const Tabs: FC<TabsProps> = ({ nfts, tab, setTab }) => {
  return (
    <div className="text-white capitalize flex items-center gap-2 w-full md:w-auto">
      <button
        className="w-1/2 md:w-auto border border-white/30 py-2 px-2 lg:px-4 rounded-lg font-medium text-center capitalize text-sm lg:text-lg"
        title="Unstaked NFTs"
        style={{
          color: tab === "unstaked" ? "#fff" : "#ffffff60",
        }}
        onClick={() => setTab("unstaked")}
      >
        unstaked ({nfts.filter((nft) => !nft.staked).length})
      </button>
      <button
        className="w-1/2 md:w-auto border border-white/30 py-2 px-2 lg:px-4 rounded-lg font-medium text-center capitalize text-sm lg:text-lg"
        title="Staked NFTs"
        style={{
          color: tab === "staked" ? "#fff" : "#ffffff60",
        }}
        onClick={() => setTab("staked")}
      >
        staked ({nfts.filter((nft) => nft.staked).length})
      </button>
    </div>
  );
};
