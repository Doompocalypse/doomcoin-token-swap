import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ARBITRUM_CHAIN_ID, SEPOLIA_CHAIN_ID, switchToNetwork } from "@/utils/chainConfig";
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
        const currentChainId = await provider.request({ method: 'eth_chainId' });
        console.log("Current chain ID:", currentChainId);

        // Allow both Arbitrum and Sepolia
        if (currentChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase() && 
            currentChainId.toLowerCase() !== SEPOLIA_CHAIN_ID.toLowerCase()) {
          // Default to Sepolia for NFT marketplace
          await switchToNetwork(SEPOLIA_CHAIN_ID);
        }
        
        setAccounts(accounts);
        setChainId(currentChainId);
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
  }, [getMetaMaskProvider, validateProvider, clearExistingPermissions, requestAccounts, onConnect, toast]);

  return {
    accounts,
    chainId,
    setAccounts,
    setChainId,
    connectMetaMask,
  };
};