import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWalletEvents } from "./useWalletEvents";
import { useWalletDisconnect } from "./useWalletDisconnect";
import { useInitialConnection } from "./useInitialConnection";

export const useWalletConnection = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();

  // Use the extracted hooks
  useWalletEvents(onConnect, setChainId, setAccounts);
  const { disconnectWallet } = useWalletDisconnect(setAccounts, onConnect, toast);
  useInitialConnection(setAccounts, setChainId, onConnect);

  const connectWallet = async () => {
    if (typeof window === 'undefined') return;

    if (!window.ethereum) {
      // Open WalletConnect modal
      const wcProjectId = "0d63e4b93b8abc2ea0a58328d7e7c053";
      const wcModal = document.createElement('w3m-core');
      wcModal.setAttribute('project-id', wcProjectId);
      wcModal.setAttribute('theme', 'dark');
      document.body.appendChild(wcModal);
      
      toast({
        title: "Connect Wallet",
        description: "Please select a wallet to connect",
      });
      return;
    }

    try {
      console.log("Requesting accounts...");
      
      const newAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("New accounts received:", newAccounts);
      if (newAccounts.length > 0) {
        setAccounts(newAccounts);
        onConnect(true, newAccounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected to account: ${newAccounts[0].slice(0, 6)}...${newAccounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    accounts,
    chainId,
    connectWallet,
    disconnectWallet
  };
};