import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import AmountInput from "./AmountInput";
import SwapButton from "./SwapButton";
import { handleTokenExchange } from "@/utils/web3Transactions";

interface ExchangeFormProps {
  isConnected: boolean;
  connectedAccount?: string;
  ethPrice: number;
  isMobile: boolean;
}

interface TransactionResult {
  txHash: string;
}

const ExchangeForm = ({ isConnected, connectedAccount, ethPrice, isMobile }: ExchangeFormProps) => {
  const [usdAmount, setUsdAmount] = useState("");
  const [ethValue, setEthValue] = useState("0.00");
  const [currentTxHash, setCurrentTxHash] = useState<string>("");
  const { toast } = useToast();

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
    if (isMobile) {
      toast({
        title: "Desktop Only",
        description: "Please use a desktop device to perform token swaps.",
        variant: "destructive",
      });
      return;
    }

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
      
      const result = await handleTokenExchange(connectedAccount, ethValue, usdAmount) as TransactionResult;
      
      console.log("Transaction hash:", result.txHash);
      setCurrentTxHash(result.txHash);
      
      toast({
        title: "ETH Transfer Initiated",
        description: `Your ETH transfer is being processed. Transaction hash: ${result.txHash.slice(0, 6)}...${result.txHash.slice(-4)}`,
      });

      toast({
        title: "DMC Transfer Pending",
        description: `Once your ETH transfer is confirmed, ${usdAmount} DMC tokens will be sent to your wallet automatically.`,
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
    <div className="space-y-6">
      <AmountInput
        usdAmount={usdAmount}
        ethPrice={ethPrice}
        ethValue={ethValue}
        onAmountChange={setUsdAmount}
      />
      <div className="text-base text-white text-center bg-transparent p-4 rounded border border-[#8E9196]/20 space-y-3">
        <p>Please ensure you are connected to the Arbitrum One network before swapping tokens</p>
        {isMobile && (
          <p className="text-red-400">Token swapping is currently only available on desktop devices</p>
        )}
        {currentTxHash && (
          <p className="text-sm text-gray-400 break-all">
            Current Transaction: {currentTxHash}
          </p>
        )}
      </div>
      <SwapButton
        isConnected={isConnected}
        disabled={!usdAmount || !isConnected || isMobile}
        onClick={handleExchange}
      />
    </div>
  );
};

export default ExchangeForm;