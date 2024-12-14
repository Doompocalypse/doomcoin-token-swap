import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AmountInput from "./exchange/AmountInput";
import SwapButton from "./exchange/SwapButton";
import ContractInfo from "./exchange/ContractInfo";

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

  const handleExchange = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!window.ethereum) {
      toast({
        title: "Web3 Not Available",
        description: "Please install a Web3 wallet like MetaMask",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Initiating token exchange...");
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const account = accounts[0];
      console.log("Connected account:", account);

      // Convert ETH amount to Wei (1 ETH = 10^18 Wei)
      const weiValue = BigInt(Math.floor(Number(ethValue) * 1e18)).toString(16);
      
      // Create transaction parameters for ETH transfer
      const transactionParameters = {
        from: account,
        to: "0x2088891D40e755d83e1990d70fdb7e65a384e9B0", // Bot Wallet address
        value: `0x${weiValue}`, // Value in Wei (hexadecimal)
        data: "0x", // No additional data needed for basic ETH transfer
      };

      console.log("Transaction parameters:", transactionParameters);

      // Send ETH transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log("ETH Transaction hash:", txHash);

      // Create ERC20 transfer data
      const transferAmount = BigInt(Math.floor(Number(ethValue) * 1e18)).toString(16); // Same amount in tokens
      const transferData = `0xa9059cbb${account.slice(2).padStart(64, '0')}${transferAmount.padStart(64, '0')}`;

      // Create transaction parameters for token transfer
      const tokenTransactionParameters = {
        from: "0x2088891D40e755d83e1990d70fdb7e65a384e9B0", // Bot Wallet
        to: "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073", // DoomCoin Contract
        data: transferData,
        value: "0x0" // No ETH value for token transfer
      };

      console.log("Token transaction parameters:", tokenTransactionParameters);

      // Send token transaction
      const tokenTxHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tokenTransactionParameters],
      });

      console.log("Token Transaction hash:", tokenTxHash);

      toast({
        title: "Transactions Sent",
        description: "Your exchange transactions have been submitted",
      });
    } catch (error) {
      console.error("Exchange error:", error);
      toast({
        title: "Exchange Failed",
        description: error instanceof Error ? error.message : "Transaction failed. Please try again.",
        variant: "destructive",
      });
    }
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