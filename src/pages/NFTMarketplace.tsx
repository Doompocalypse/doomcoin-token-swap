import { useToast } from "@/hooks/use-toast";
import VideoBackground from "@/components/VideoBackground";
import CountdownTimer from "@/components/CountdownTimer";
import { Suspense, useState } from "react";
import Header from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import ProductSlider from "@/components/products/ProductSlider";

const NFTMarketplace = () => {
  const { toast } = useToast();
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const navigate = useNavigate();

  const handleConnect = (connected: boolean, account?: string) => {
    console.log("Connection status:", connected, "Account:", account);
    setConnectedAccount(account);
  };

  const handleInsufficientBalance = () => {
    toast({
      title: "Insufficient DMC Balance",
      description: (
        <div className="space-y-2">
          <p>You don't have enough DMC tokens to mint this NFT.</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Click here to swap tokens
          </button>
        </div>
      ),
      variant: "destructive",
    });
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <VideoBackground />
      <div className="relative min-h-screen">
        <Header onConnect={handleConnect} />
        <main className="pt-24 pb-12 px-4">
          <div className="w-full max-w-5xl mx-auto space-y-16">
            <CountdownTimer />
            <ProductSlider 
              connectedAccount={connectedAccount}
              onInsufficientBalance={handleInsufficientBalance}
            />
          </div>
        </main>
      </div>
    </Suspense>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Loading application...</div>
  </div>
);

export default NFTMarketplace;