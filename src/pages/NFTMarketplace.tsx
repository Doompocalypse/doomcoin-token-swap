import { useToast } from "@/components/ui/use-toast";
import VideoBackground from "@/components/VideoBackground";
import CountdownTimer from "@/components/CountdownTimer";
import { Suspense, useState } from "react";
import Header from "@/components/layout/Header";
import NFTSection from "@/components/sections/NFTSection";
import MysteryBoxSection from "@/components/sections/MysteryBoxSection";

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Loading application...</div>
  </div>
);

const NFTMarketplace = () => {
  const { toast } = useToast();
  const [connectedAccount, setConnectedAccount] = useState<string>();

  const handleConnect = (connected: boolean, account?: string) => {
    console.log("Connection status:", connected, "Account:", account);
    setConnectedAccount(account);
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <VideoBackground />
      <div className="relative min-h-screen">
        <Header onConnect={handleConnect} />
        <main className="pt-24 pb-12 px-4">
          <div className="w-full max-w-5xl mx-auto space-y-16">
            <CountdownTimer />
            <NFTSection connectedAccount={connectedAccount} />
            <MysteryBoxSection connectedAccount={connectedAccount} />
          </div>
        </main>
      </div>
    </Suspense>
  );
};

export default NFTMarketplace;