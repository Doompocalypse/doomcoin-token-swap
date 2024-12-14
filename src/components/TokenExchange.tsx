import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AmountInput from "./exchange/AmountInput";
import SwapButton from "./exchange/SwapButton";
import ContractInfo from "./exchange/ContractInfo";
import { fetchEthPrice } from "@/utils/ethPrice";

interface TokenExchangeProps {
  isConnected: boolean;
  connectedAccount?: string;
}

const TokenExchange = ({ isConnected, connectedAccount }: TokenExchangeProps) => {
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

  const handleExchange = async () => {
    if (!isConnected || !connectedAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting exchange with account:", connectedAccount);
    toast({
      title: "Exchange Started",
      description: "Your exchange request is being processed",
    });
  };

  return (
    <Card className="p-6 space-y-4 bg-[#221F26] border-[#8E9196]/20">
      <div className="space-y-4">
        <AmountInput
          usdAmount={usdAmount}
          ethPrice={ethPrice}
          ethValue={ethValue}
          onAmountChange={setUsdAmount}
        />
        <SwapButton
          isConnected={isConnected}
          disabled={!usdAmount || !isConnected}
          onClick={handleExchange}
        />
        <ContractInfo />
      </div>
    </Card>
  );
};

export default TokenExchange;