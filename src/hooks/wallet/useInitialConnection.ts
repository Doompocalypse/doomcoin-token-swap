import { useEffect } from "react";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useInitialConnection = (
  setAccounts: (accounts: string[]) => void,
  setChainId: (chainId: string) => void,
  onConnect: (connected: boolean, account?: string) => void
) => {
  useEffect(() => {
    const checkConnection = async () => {
      // Check if user explicitly disconnected in their last session
      const wasDisconnected = localStorage.getItem('wallet_disconnected') === 'true';
      
      if (wasDisconnected) {
        console.log("User was previously disconnected, skipping auto-connect");
        setAccounts([]);
        onConnect(false);
        return;
      }

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
        
        // Only connect if we have accounts AND we're on Arbitrum One AND user hasn't disconnected
        if (currentAccounts.length > 0 && 
            !wasDisconnected && 
            currentChainId.toLowerCase() === ARBITRUM_CHAIN_ID.toLowerCase()) {
          console.log("Auto-connecting to previously connected wallet");
          setAccounts(currentAccounts);
          onConnect(true, currentAccounts[0]);
        } else {
          console.log("Not auto-connecting: conditions not met");
          setAccounts([]);
          onConnect(false);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        setAccounts([]);
        onConnect(false);
      }
    };

    checkConnection();
  }, [setAccounts, setChainId, onConnect]);
};