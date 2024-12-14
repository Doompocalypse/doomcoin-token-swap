import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import TokenExchange from "@/components/TokenExchange";
import TransactionHistory from "@/components/TransactionHistory";
import WalletConnect from "@/components/WalletConnect";
import Doomy from "@/components/Doomy";
import { useState } from "react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = (connected: boolean) => {
    setIsConnected(connected);
    if (connected) {
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#221F26] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-[#F1F1F1]">
            Swap Tokens
          </h1>
          <WalletConnect onConnect={handleConnect} />
        </div>

        <div className="space-y-8">
          <TokenExchange isConnected={isConnected} />
          <TransactionHistory />
        </div>
      </div>
      <Doomy />
    </div>
  );
};

export default Index;