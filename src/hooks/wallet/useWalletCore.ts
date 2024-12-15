import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useWalletCore = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();

  const getMetaMaskProvider = () => {
    console.log("Detecting MetaMask provider...");
    
    // Check for multiple providers
    if (window.ethereum?.providers?.length > 0) {
      console.log("Multiple providers detected:", window.ethereum.providers);
      // Explicitly find MetaMask provider
      const metaMaskProvider = window.ethereum.providers.find(
        (p: any) => p.isMetaMask && !p.isCoinbaseWallet
      );
      if (metaMaskProvider) {
        console.log("Found explicit MetaMask provider in providers array");
        return metaMaskProvider;
      }
    }
    
    // Check single provider case
    if (window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet) {
      console.log("Found MetaMask as single provider");
      return window.ethereum;
    }
    
    console.log("No valid MetaMask provider found");
    return null;
  };

  const connectMetaMask = async () => {
    console.log("Starting MetaMask connection attempt...");
    
    const provider = getMetaMaskProvider();
    
    if (!provider) {
      console.error("MetaMask provider not found");
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect. If you have other wallet extensions, please disable them temporarily.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Verify it's really MetaMask before proceeding
      if (!provider.isMetaMask || provider.isCoinbaseWallet) {
        throw new Error("Invalid wallet detected. Please ensure you're using MetaMask.");
      }

      console.log("Using verified MetaMask provider:", provider);
      
      // Clear existing permissions
      try {
        await provider.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }]
        });
        console.log("Cleared existing permissions");
      } catch (error) {
        console.log("No permissions to revoke:", error);
      }
      
      // Request accounts with force flag
      const accounts = await provider.request({
        method: "eth_requestAccounts",
        params: [{ force: true }]
      });
      
      console.log("Accounts after selection:", accounts);
      
      if (accounts.length > 0) {
        const currentChainId = await provider.request({
          method: 'eth_chainId'
        });
        
        if (currentChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase()) {
          try {
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ARBITRUM_CHAIN_ID }],
            });
          } catch (switchError: any) {
            console.error("Network switch error:", switchError);
            if (switchError.code === 4902) {
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: ARBITRUM_CHAIN_ID,
                  chainName: 'Arbitrum One',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                  blockExplorerUrls: ['https://arbiscan.io/']
                }]
              });
            } else {
              throw switchError;
            }
          }
        }
        
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
        description: error.message || "Failed to connect to MetaMask. Please ensure you're using the correct wallet.",
        variant: "destructive",
      });
    }
  };

  return {
    accounts,
    chainId,
    setAccounts,
    setChainId,
    connectMetaMask,
  };
};