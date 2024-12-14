import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import TokenExchange from "@/components/TokenExchange";
import TransactionHistory from "@/components/TransactionHistory";
import WalletConnect from "@/components/WalletConnect";
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
    <div className="min-h-screen bg-[#1A1F2C] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] bg-clip-text text-transparent">
            Swap Tokens
          </h1>
          <WalletConnect onConnect={handleConnect} />
        </div>

        <div className="space-y-8">
          <TokenExchange isConnected={isConnected} />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Index;