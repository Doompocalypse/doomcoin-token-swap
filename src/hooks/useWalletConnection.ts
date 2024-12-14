import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SUPPORTED_CHAINS } from "@/utils/chainConfig";

export const useWalletConnection = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        console.log("No Web3 wallet detected");
        return;
      }

      try {
        const currentAccounts = await window.ethereum.request({ method: "eth_accounts" });
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        console.log("Current connected accounts:", currentAccounts);
        console.log("Current chain ID:", currentChainId);
        
        setChainId(currentChainId);
        
        if (currentAccounts.length > 0) {
          setAccounts(currentAccounts);
          onConnect(true, currentAccounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        setAccounts([]);
      }
    };

    checkConnection();

    const handleAccountsUpdate = (newAccounts: string[]) => {
      setAccounts(newAccounts);
      if (newAccounts.length > 0) {
        onConnect(true, newAccounts[0]);
      } else {
        onConnect(false);
      }
    };

    const handleChainUpdate = async (newChainId: string) => {
      console.log("Chain ID updated:", newChainId);
      setChainId(newChainId);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsUpdate);
      window.ethereum.on('chainChanged', handleChainUpdate);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsUpdate);
        window.ethereum.removeListener('chainChanged', handleChainUpdate);
      };
    }
  }, [onConnect]);

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
    connectWallet
  };
};