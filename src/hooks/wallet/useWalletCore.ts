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
      console.log("Opening WalletConnect modal...");
      
      // First, open the WalletConnect modal
      await open();
      
      // We need to wait for the connection to be established
      // The Web3Modal will handle the QR code display and scanning
      if (isConnected && address) {
        console.log("WalletConnect connection successful:", address);
        
        // Check if we need to switch networks first
        if (chain?.id !== arbitrum.id) {
          console.log("Switching to Arbitrum network...");
          try {
            await switchNetwork?.(arbitrum.id);
          } catch (error) {
            console.error("Failed to switch network:", error);
            toast({
              title: "Network Switch Failed",
              description: "Please manually switch to Arbitrum network in your wallet.",
              variant: "destructive",
            });
            return;
          }
        }
        
        // Now we can set the account
        setAccounts([address]);
        setChainId(chain?.id.toString(16));
        onConnect(true, address);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to account: ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
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