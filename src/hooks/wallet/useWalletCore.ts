import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import { useMetaMaskProvider } from "./useMetaMaskProvider";
import { useNetworkSwitch } from "./useNetworkSwitch";
import { useWalletPermissions } from "./useWalletPermissions";

export const useWalletCore = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();
  
  const { getMetaMaskProvider, validateProvider } = useMetaMaskProvider();
  const { switchToArbitrum } = useNetworkSwitch();
  const { clearExistingPermissions, requestAccounts } = useWalletPermissions();

  const connectMetaMask = useCallback(async () => {
    console.log("Starting MetaMask connection attempt...");
    
    const provider = getMetaMaskProvider();
    
    if (!validateProvider(provider)) {
      return;
    }

    try {
      console.log("Using verified MetaMask provider:", provider);
      
      await clearExistingPermissions(provider);
      const accounts = await requestAccounts(provider);
      
      console.log("Accounts after selection:", accounts);
      
      if (accounts.length > 0) {
        await switchToArbitrum(provider);
        
        setAccounts(accounts);
        setChainId(ARBITRUM_CHAIN_ID);
        onConnect(true, accounts[0]);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to MetaMask: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    }
  }, [getMetaMaskProvider, validateProvider, clearExistingPermissions, requestAccounts, switchToArbitrum, onConnect, toast]);

  return {
    accounts,
    chainId,
    setAccounts,
    setChainId,
    connectMetaMask,
  };
};