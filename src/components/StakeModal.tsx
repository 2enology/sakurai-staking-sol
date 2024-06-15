"use client";

import { FC, useEffect, useState } from "react";
import { CloseIcon } from "./SvgIcon";
import { useModal } from "@/contexts/ModalProvider";
import { Nft } from "@/utils/type";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { lockPnft } from "@/transaction/cli/txScripts";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import useNfts from "@/hooks/useNfts";

interface ModalProps {
  nfts: Nft[];
}

const StakeModal: FC<ModalProps> = ({ nfts }) => {
  const { closeModal } = useModal();
  const wallet = useWallet();
  const { fetchNfts } = useNfts(wallet.publicKey);

  const [plan, setPlan] = useState<0 | 1 | 2>(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [closeModal]);

  const btnClass =
    "uppercase border-2 font-bold border-white text-white py-4 px-8 hover:bg-pink-800 duration-200 disabled:opacity-30 disabled:cursor-no-drop w-full bg-pink-800/60";

  const handleStake = async () => {
    setLoading(true);
    try {
      const res = await lockPnft(
        wallet,
        nfts.map((item) => new PublicKey(item.mint)),
        // plan
      );
      toast.success("NFT Staking success");
      await fetchNfts();
      closeModal();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed left-0 top-0 w-screen h-screen z-[999] grid place-content-center backdrop-blur-sm bg-black/30">
      <div
        className="absolute left-0 top-0 w-full h-full"
        onClick={closeModal}
      />
      <div className="w-[720px] min-h-[360px] relative z-20 border border-white/20 p-4 bg-black/80 flex ">
        <button
          className="absolute right-4 top-4 opacity-70 hover:opacity-100"
          onClick={closeModal}
        >
          <CloseIcon />
        </button>

        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="p-2 grid grid-cols-2 gap-4">
            {nfts.map(
              (nft, key) =>
                key < 3 && (
                  <div
                    className="relative w-[148px] h-[148px] aspect-square"
                    key={key}
                  >
                    <Image
                      src={nft.image}
                      unoptimized
                      width={148}
                      height={148}
                      objectFit="cover"
                      alt=""
                    />
                  </div>
                )
            )}
            {nfts.length > 3 && (
              <div className="relative aspect-square border-2 border-white/50 grid place-content-center text-white text-3xl font-bold">
                + {nfts.length - 3}
              </div>
            )}
          </div>
          <div className="">
            <div className="">
              <PlanItem
                plan={0}
                current={plan}
                setPlan={() => setPlan(0)}
                title="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur viverra, nulla in eleifend condimentum,"
              />
              <PlanItem
                plan={1}
                current={plan}
                setPlan={() => setPlan(1)}
                title="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur viverra, nulla in eleifend condimentum,"
              />
              <PlanItem
                plan={2}
                current={plan}
                setPlan={() => setPlan(2)}
                title="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur viverra, nulla in eleifend condimentum,"
              />
            </div>
            <button
              className={btnClass}
              disabled={loading}
              onClick={handleStake}
            >
              {loading ? "Staking..." : "Stake"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeModal;

interface PlanProps {
  plan: 0 | 1 | 2;
  current: 0 | 1 | 2;
  title: string;
  setPlan: () => void;
}

const PlanItem: FC<PlanProps> = ({ plan, current, title, setPlan }) => {
  return (
    <div className="mb-4 cursor-pointer" onClick={setPlan}>
      <div className="flex gap-2 items-center">
        <div
          className="w-4 h-4 border border-white"
          style={{
            background: plan === current ? "white" : "transparent",
          }}
        ></div>
        <div className="uppercase text-white font-bold">Plan 3</div>
      </div>
      <div className="text-sm text-white/80">{title}</div>
    </div>
  );
};
