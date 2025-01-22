import { useToast } from "@/components/ui/use-toast";
import VideoBackground from "@/components/VideoBackground";
import CountdownTimer from "@/components/CountdownTimer";
import { Suspense, useState } from "react";
import Header from "@/components/layout/Header";
import NFTSection from "@/components/sections/NFTSection";
import MysteryBoxSection from "@/components/sections/MysteryBoxSection";
import { useWallet } from "@/contexts/WalletContext";

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Loading application...</div>
  </div>
);

const About = () => {
  const { toast } = useToast();
  const { walletAddress } = useWallet();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <VideoBackground />
      <div className="relative min-h-screen">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="w-full max-w-5xl mx-auto space-y-16">
            <CountdownTimer />
            <NFTSection connectedAccount={walletAddress} />
            <MysteryBoxSection connectedAccount={walletAddress} />
          </div>
        </main>
      </div>
    </Suspense>
  );
};

export default About;