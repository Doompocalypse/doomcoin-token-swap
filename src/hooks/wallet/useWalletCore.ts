import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMetaMaskConnection } from "./useMetaMaskConnection";
import { useWalletConnectConnection } from "./useWalletConnectConnection";
import { useNetworkSwitch } from "./useNetworkSwitch";
import { useInitialConnection } from "./useInitialConnection";

export const useWalletCore = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();
  const { ensureArbitrumNetwork } = useNetworkSwitch();
  const { connectMetaMask } = useMetaMaskConnection();
  const { connectWalletConnect } = useWalletConnectConnection();

  // Use the initial connection hook to prevent auto-connects
  useInitialConnection(setAccounts, setChainId, onConnect);

  const handleSuccessfulConnection = async (newAccounts: string[]) => {
    console.log("Handling successful connection with accounts:", newAccounts);
    
    // Get current chain ID directly from ethereum provider
    let currentChainId;
    if (window.ethereum) {
      currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    }
    
    setAccounts(newAccounts);
    setChainId(currentChainId);
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