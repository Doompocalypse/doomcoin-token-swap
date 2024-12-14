import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface TokenExchangeProps {
  isConnected: boolean;
}

const TokenExchange = ({ isConnected }: TokenExchangeProps) => {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleExchange = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feature Not Available",
      description: "Token exchange functionality is not implemented in this demo",
    });
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Exchange Tokens</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Amount (ETH)</label>
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-secondary"
          />
        </div>

        <div className="flex justify-center">
          <div className="gradient-border">
            <Button
              onClick={handleExchange}
              disabled={!amount || !isConnected}
              className="bg-background hover:bg-secondary transition-colors"
            >
              Exchange
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Contract Address: 0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073</p>
          <p>Bot Wallet: 0x2088891D40e755d83e1990d70fdb7e65a384e9B0</p>
        </div>
      </div>
    </Card>
  );
};

export default TokenExchange;