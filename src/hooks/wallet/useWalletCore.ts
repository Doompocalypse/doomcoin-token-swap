import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useWalletCore = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();

  const connectMetaMask = async () => {
    if (!window.ethereum?.isMetaMask) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Requesting fresh MetaMask connection...");
      
      // First, clear any existing permissions
      try {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }]
        });
      } catch (error) {
        console.log("No permissions to revoke:", error);
      }
      
      // Force new account selection
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ force: true }] // Force new account selection
      });
      
      console.log("Accounts after selection:", accounts);
      
      if (accounts.length > 0) {
        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId'
        });
        
        if (currentChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase()) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ARBITRUM_CHAIN_ID }],
            });
          } catch (switchError: any) {
            console.error("Network switch error:", switchError);
            if (switchError.code === 4902) {
              await window.ethereum.request({
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
          description: `Connected to account: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to MetaMask",
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