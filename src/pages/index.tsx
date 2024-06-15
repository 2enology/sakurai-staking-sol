import { Background } from "@/components/Widgets";

import dynamic from "next/dynamic";
import Head from "next/head";
const MainPage = dynamic(() => import("@/components/MainPage"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen backdrop-blur-lg bg-black">
      <Head>
        <title>Sakurai NFT Staking</title>
      </Head>
      <MainPage />
      <Background />
    </main>
  );
}
