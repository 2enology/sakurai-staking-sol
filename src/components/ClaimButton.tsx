import Image from "next/image";
import React from "react";

interface ClaimProps {
  claim: () => Promise<void>;
  loading: boolean;
}

export default function ClaimButton({ claim, loading }: ClaimProps) {
  return (
    <button
      className="px-5 border font-medium rounded-lg bg-white/15 hover:bg-white/10 duration-200 disabled:opacity-70 border-white/20 disabled:pointer-events-none text-white md:w-[200px] grid place-content-center h-8 md:h-10 text-xs md:text-sm"
      onClick={claim}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Image
            width={24}
            height={24}
            className="animate-spin "
            src="/icons/spinner.png"
            alt=""
          />
          Claiming...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Image
            width={20}
            height={20}
            className="rounded-full border border-yellow-500"
            src="/icons/token.webp"
            alt=""
          />
          Claim Reward
        </div>
      )}
    </button>
  );
}
