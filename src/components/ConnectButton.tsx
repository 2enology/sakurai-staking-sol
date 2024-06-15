"use client";

import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ArrowLine, ExitIcon, WalletIcon } from "./SvgIcon";

const ConnectButton: FC = () => {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect } = useWallet();

  return (
    <button className="rounded-lg border border-[#ffffff20] bg-[#272727]  text-[#ffffff] tracking-[0.32px] py-2 px-2 w-[180px] group relative h-10">
      {publicKey ? (
        <>
          <div className="flex items-center justify-center text-sm">
            {publicKey.toBase58().slice(0, 4)}....
            {publicKey.toBase58().slice(-4)}
            <div className="rotate-90 w-5 h-5">
              <ArrowLine className="w-5 h-5" />
            </div>
          </div>
          <div className="w-[180px] absolute right-0 top-9 hidden group-hover:block">
            <ul className="border border-[#ffffff20] rounded-lg bg-[#272727] p-2 mt-2">
              <li>
                <div
                  className="flex gap-2 items-center mb-1 text-white/90 text-sm tracking-[-0.32px]"
                  onClick={() => setVisible(true)}
                >
                  <WalletIcon className="w-4 h-4" fill="#ffffff" /> Change
                  Wallet
                </div>
              </li>
              <li>
                <div
                  className="flex gap-2 items-center text-white/90 text-sm tracking-[-0.32px]"
                  onClick={disconnect}
                >
                  <ExitIcon className="w-4 h-4" fill="#ffffff" /> Disconnect
                </div>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div
          className="flex items-center justify-center gap-1 text-sm"
          onClick={() => setVisible(true)}
        >
          Connect wallet <ArrowLine />
        </div>
      )}
    </button>
  );
};

export default ConnectButton;
