import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { switchToArbitrum } from "@/utils/chainConfig";
import { setupWalletEventHandlers } from "@/utils/walletEvents";

export const useWalletConnection = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        console.log("MetaMask not installed");
        return;
      }

      try {
        const currentAccounts = await window.ethereum.request({ method: "eth_accounts" });
        console.log("Current connected accounts:", currentAccounts);
        
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

    setupWalletEventHandlers(handleAccountsUpdate);

    return () => {
      setupWalletEventHandlers(handleAccountsUpdate, true);
    };
  }, [onConnect, toast]);

  const connectWallet = async () => {
    if (typeof window === 'undefined') return;

    if (accounts.length > 0) {
      console.log("Wallet already connected:", accounts[0]);
      return;
    }

    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Requesting accounts...");
      
      const switched = await switchToArbitrum();
      if (!switched) {
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to Arbitrum One network",
          variant: "destructive",
        });
        return;
      }

      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      
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
    connectWallet
  };
};