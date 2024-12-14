import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AmountInput from "./exchange/AmountInput";
import SwapButton from "./exchange/SwapButton";
import ContractInfo from "./exchange/ContractInfo";
import { fetchEthPrice } from "@/utils/ethPrice";
import { handleTokenExchange } from "@/utils/web3Transactions";

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

    if (!usdAmount || Number(usdAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }

    // Add validation for minimum and maximum amounts in USD
    const usdValue = Number(usdAmount);
    if (usdValue < 5) {
      toast({
        title: "Amount Too Small",
        description: "Minimum transaction amount is $5",
        variant: "destructive",
      });
      return;
    }

    if (usdValue > 50000) {
      toast({
        title: "Amount Too Large",
        description: "Maximum transaction amount is $50,000",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Starting exchange with account:", connectedAccount);
      console.log("Requested USD amount:", usdAmount);
      console.log("Equivalent ETH amount:", ethValue);
      
      const { txHash } = await handleTokenExchange(connectedAccount, ethValue, usdAmount);
      
      console.log("Transaction hash:", txHash);
      toast({
        title: "Exchange Initiated",
        description: `Your ETH has been sent. ${usdAmount} DMC tokens will be transferred to your wallet automatically.`,
      });
    } catch (error) {
      console.error("Exchange error:", error);
      toast({
        title: "Exchange Failed",
        description: error instanceof Error ? error.message : "Failed to process the exchange",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-transparent border-[#8E9196]/20">
      <div className="space-y-4">
        <AmountInput
          usdAmount={usdAmount}
          ethPrice={ethPrice}
          ethValue={ethValue}
          onAmountChange={setUsdAmount}
        />
        <div className="text-sm text-white text-center bg-[#1A1F2C] p-2 rounded">
          Please ensure you are connected to the Arbitrum One network before swapping tokens
        </div>
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