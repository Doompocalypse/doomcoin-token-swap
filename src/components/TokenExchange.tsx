import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface TokenExchangeProps {
  isConnected: boolean;
}

const fetchEthPrice = async () => {
  console.log("Fetching ETH price from CoinGecko...");
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("ETH price data received:", data);
    return data.ethereum.usd;
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return 2500; // Fallback price if API fails
  }
};

const TokenExchange = ({ isConnected }: TokenExchangeProps) => {
  const [usdAmount, setUsdAmount] = useState("");
  const [ethValue, setEthValue] = useState("0.00");
  const { toast } = useToast();

  const { data: ethPrice = 2500 } = useQuery({
    queryKey: ["ethPrice"],
    queryFn: fetchEthPrice,
    refetchInterval: 60000,
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Price Update Failed",
          description: "Using fallback price. Please try again later.",
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    console.log("Calculating ETH value with USD amount:", usdAmount);
    const calculateEthValue = () => {
      if (!usdAmount || isNaN(Number(usdAmount))) {
        setEthValue("0.00");
        return;
      }
      const eth = Number(usdAmount) / ethPrice;
      setEthValue(eth.toFixed(6));
    };

    calculateEthValue();
  }, [usdAmount, ethPrice]);

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
    <Card className="p-6 space-y-4 bg-[#221F26] border-[#8E9196]/20">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-[#8E9196]">Amount (USD)</label>
            <span className="text-xs text-[#8E9196]">
              1 ETH = ${ethPrice.toLocaleString()} USD
            </span>
          </div>
          <Input
            type="number"
            placeholder="0.0"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            className="bg-[#1A1F2C] border-[#8E9196]/20 focus:border-[#8E9196] text-lg"
          />
          <p className="mt-2 text-sm text-[#8E9196]">≈ {ethValue} ETH</p>
        </div>

        <Button
          onClick={handleExchange}
          disabled={!usdAmount || !isConnected}
          className="w-full bg-[#33C3F0] hover:opacity-90 transition-opacity text-white font-medium py-6"
        >
          {isConnected ? "Swap" : "Connect Wallet to Swap"}
        </Button>

        <div className="text-xs text-[#8E9196] space-y-1">
          <p>Contract Address: 0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073</p>
          <p>Bot Wallet: 0x2088891D40e755d83e1990d70fdb7e65a384e9B0</p>
        </div>
      </div>
    </Card>
  );
};

export default TokenExchange;