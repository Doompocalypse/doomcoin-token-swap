import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useInitialConnection } from "./useInitialConnection";
import { useWalletDisconnect } from "./useWalletDisconnect";
import { useWalletEvents } from "./useWalletEvents";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useWalletConnection = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();

  useInitialConnection(setAccounts, setChainId, onConnect);
  useWalletEvents(onConnect, setChainId, setAccounts);

  const { disconnectWallet, forceDisconnectWallet } = useWalletDisconnect(setAccounts, onConnect, { toast });

  const connectWallet = async (walletType?: "metamask" | "walletconnect", selectedAccount?: string) => {
    if (typeof window === 'undefined') return;

    // If a specific account is selected, switch to it
    if (selectedAccount && accounts.includes(selectedAccount)) {
      console.log("Switching to account:", selectedAccount);
      setAccounts([selectedAccount]);
      onConnect(true, selectedAccount);
      return;
    }

    // Clear the disconnected flag when user explicitly connects
    localStorage.removeItem('wallet_disconnected');

    // Handle WalletConnect
    if (walletType === "walletconnect" || (!window.ethereum && !walletType)) {
      console.log("Opening WalletConnect modal");
      const wcProjectId = "0d63e4b93b8abc2ea0a58328d7e7c053";
      const wcModal = document.createElement('w3m-core');
      wcModal.setAttribute('project-id', wcProjectId);
      wcModal.setAttribute('theme', 'dark');
      document.body.appendChild(wcModal);
      
      toast({
        title: "Connect Wallet",
        description: "Please select a wallet to connect using WalletConnect",
      });
      return;
    }

    // Handle MetaMask or default case
    try {
      console.log("Starting wallet connection process...");
      
      // First, try to switch to Arbitrum One
      try {
        console.log("Requesting network switch to Arbitrum One...");
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ARBITRUM_CHAIN_ID }],
        });
        console.log("Successfully switched to Arbitrum One");
      } catch (switchError: any) {
        console.log("Network switch error:", switchError);
        if (switchError.code === 4902) {
          console.log("Arbitrum One not found, attempting to add network...");
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: ARBITRUM_CHAIN_ID,
                chainName: 'Arbitrum One',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io/']
              }]
            });
            console.log("Successfully added Arbitrum One network");
          } catch (addError) {
            console.error("Error adding Arbitrum network:", addError);
            throw addError;
          }
        } else if (switchError.code === 4001) {
          console.log("User rejected network switch");
          toast({
            title: "Network Switch Required",
            description: "Please switch to Arbitrum One network to continue",
            variant: "destructive",
          });
          return;
        } else {
          console.error("Unexpected error switching network:", switchError);
          throw switchError;
        }
      }
      
      // Request accounts
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
    } catch (error: any) {
      console.error("Connection error:", error);
      let errorMessage = "Failed to connect to your wallet. Please try again.";
      
      if (error.code === 4001) {
        errorMessage = "You rejected the connection request.";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending. Please check your wallet.";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    accounts,
    chainId,
    connectWallet,
    disconnectWallet,
    forceDisconnectWallet
  };
};