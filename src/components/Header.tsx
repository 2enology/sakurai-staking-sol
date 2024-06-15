"use client";

import { FC, useEffect, useState } from "react";
import ConnectButton from "@/components/ConnectButton";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { solConnection } from "@/utils/util";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolanaIcon } from "./SvgIcon";

interface HeaderProps {
  staked: number;
}

const Header: FC<HeaderProps> = () => {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const getBalance = async () => {
    if (publicKey) {
      const price = await solConnection.getBalance(publicKey);
      setSolBalance(price / LAMPORTS_PER_SOL);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getBalance();
    // eslint-disable-next-line
  }, [publicKey, connected]);

  return (
    <header className="py-4 lg:py-7 z-50 relative">
      <div className="flex items-center justify-between max-w-[1080px]">
        <div className="text-white md:w-1/3">
          <div className="text-md md:mt-0 md:text-md flex gap-2 md:block">
            <div className="relative w-11 h-11 md:hidden">
              <Image
                fill
                className="object-contain"
                src="/images/logo.png"
                alt="Logo"
              />
            </div>
            {publicKey && (
              <div>
                <span className="text-xs md:text-sm flex gap-1 opacity-80">
                  <span className="hidden md:block">Your </span>Balance:{" "}
                </span>
                {publicKey && connected ? (
                  <>
                    {loading ? (
                      <div className="animate-pulse rounded-md  bg-white/20 loading-pice1" />
                    ) : (
                      <div className="font-bold flex items-center gap-2">
                        <SolanaIcon className="w-3 h-3 opacity-60" />
                        {solBalance.toLocaleString()}{" "}
                        <span className="opacity-60 hidden md:black">SOL</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>N/A</>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:grid md:w-1/3 place-content-center">
          <div className="relative w-[40px] md:w-[60px] h-[40px] md:h-[60px]">
            <Image
              fill
              className="object-contain"
              src="/images/logo.png"
              alt="Logo"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 md:w-1/3">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
