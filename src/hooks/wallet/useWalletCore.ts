import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { arbitrum } from 'wagmi/chains';

export const useWalletCore = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

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
      
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("Accounts after selection:", accounts);
      
      if (accounts.length > 0) {
        if (chain?.id !== arbitrum.id) {
          await switchNetwork?.(arbitrum.id);
        }
        
        setAccounts(accounts);
        setChainId(arbitrum.id.toString(16));
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

  const connectWalletConnect = async () => {
    try {
      await open();
      
      if (isConnected && address) {
        setAccounts([address]);
        setChainId(chain?.id.toString(16));
        onConnect(true, address);
      }
    } catch (error: any) {
      console.error("WalletConnect error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect with WalletConnect",
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
    connectWalletConnect,
  };
};