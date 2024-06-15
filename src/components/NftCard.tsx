import Image from "next/image";
import { FC } from "react";
import { Nft } from "@/utils/type";
import moment from "moment";
import { DAY, PLANS } from "@/config";
import { CheckMark, LockIcon } from "./SvgIcon";

interface CardProps {
  refetch: () => void;
  nft: Nft;
  selected: Nft[];
  select: () => void;
}

const NftCard: FC<CardProps> = ({ nft, selected, select }) => {
  const { staked, mint, image, stakedAt, data, lockTime } = nft;

  const isSelected = selected.findIndex((s) => s.mint === mint) !== -1;

  const lockDate =
    stakedAt +
    PLANS[`PLAN_${nft.rate / 100_000_000 - 1}` as keyof typeof PLANS] *
      DAY *
      1000;

  const isLocked = new Date().getTime() <= lockDate;

  return (
    <div
      className="relative overflow-hidden border border-gray-700 group cursor-pointer"
      onClick={select}
    >
      <div
        className="absolute right-2 top-2 z-10 rounded w-7 h-7 bg-white/40 grid place-content-center backdrop-blur-sm"
        title={`Locked at ${moment(lockDate).format("DD-MM-YYYY hh-mm")}`}
      >
        <LockIcon className="" fill="black" />
      </div>
      <div className="aspect-square relative">
        <Image src={image} objectFit="cover" unoptimized fill alt="" />
      </div>
      {staked && isLocked && (
        <div className="absolute right-2 top-2 z-10 p-2 bg-black/70 rounded-lg w-[calc(100%-16px)]">
          <div className="flex items-center justify-between w-full">
            <div className="text-white text-sm pl-1">
              Lock <i>{moment(lockDate).fromNow()}</i>
            </div>
            <Image src="/icons/locked.svg" width={24} height={24} alt="" />
          </div>
        </div>
      )}

      <div className="p-4">
        <h5 className="text-sm text-white font-bold">{data.name}</h5>
      </div>
      {staked && (
        <div className="absolute left-0 top-0 w-full h-full grid place-content-center">
          <div className="px-3 py-1 text-center text-black text-lg font-bold bg-white/40 backdrop-blur-sm">
            Plan <span className="text-red-700">{nft.rate / 100_000_000}</span>
          </div>
        </div>
      )}

      {isSelected && (
        <div
          className="absolute left-0 top-0 w-full h-full border border-pink-600 z-40 bg-pink-600/30"
          onClick={select}
        >
          <div className="absolute left-2 top-2">
            <CheckMark />
          </div>
        </div>
      )}
    </div>
  );
};

export default NftCard;
