import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMetaMaskConnection } from "./useMetaMaskConnection";
import { useWalletConnectConnection } from "./useWalletConnectConnection";
import { useNetworkSwitch } from "./useNetworkSwitch";

export const useWalletCore = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();
  const { currentChain } = useNetworkSwitch();
  const { connectMetaMask } = useMetaMaskConnection();
  const { connectWalletConnect } = useWalletConnectConnection();

  const handleSuccessfulConnection = (newAccounts: string[]) => {
    console.log("Handling successful connection with accounts:", newAccounts);
    setAccounts(newAccounts);
    setChainId(currentChain?.id.toString(16));
    onConnect(true, newAccounts[0]);
    
    toast({
      title: "Wallet Connected",
      description: `Connected to account: ${newAccounts[0].slice(0, 6)}...${newAccounts[0].slice(-4)}`,
    });
  };

  const handleMetaMaskConnection = async () => {
    try {
      console.log("Initiating MetaMask connection...");
      const newAccounts = await connectMetaMask();
      handleSuccessfulConnection(newAccounts);
    } catch (error) {
      console.error("Failed to connect MetaMask:", error);
      setAccounts([]);
      onConnect(false);
    }
  };

  const handleWalletConnectConnection = async () => {
    try {
      console.log("Initiating WalletConnect connection...");
      const newAccounts = await connectWalletConnect();
      handleSuccessfulConnection(newAccounts);
    } catch (error) {
      console.error("Failed to connect WalletConnect:", error);
      setAccounts([]);
      onConnect(false);
    }
  };

  return {
    accounts,
    chainId,
    setAccounts,
    setChainId,
    connectMetaMask: handleMetaMaskConnection,
    connectWalletConnect: handleWalletConnectConnection,
  };
};