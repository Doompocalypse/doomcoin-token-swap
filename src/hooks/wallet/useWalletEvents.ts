import { useEffect, useCallback } from "react";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useWalletEvents = (
  onConnect: (connected: boolean, account?: string) => void,
  setChainId: (chainId: string) => void,
  setAccounts: (accounts: string[]) => void
) => {
  const handleAccountsUpdate = useCallback((newAccounts: string[]) => {
    console.log("Accounts update event:", newAccounts);
    setAccounts(newAccounts);
    if (newAccounts.length > 0) {
      onConnect(true, newAccounts[0]);
    } else {
      onConnect(false);
    }
  }, [onConnect, setAccounts]);

  const handleChainUpdate = useCallback(async (newChainId: string) => {
    console.log("Chain ID updated:", newChainId);
    setChainId(newChainId);
    
    // If the new chain is not Arbitrum One, disconnect
    if (newChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase()) {
      console.log("Switched away from Arbitrum One, disconnecting");
      setAccounts([]);
      onConnect(false);
    }
  }, [onConnect, setChainId, setAccounts]);

  useEffect(() => {
    if (!window.ethereum) {
      console.log("No Web3 wallet detected in useWalletEvents");
      return;
    }

    console.log("Setting up wallet event listeners");
    window.ethereum.on('accountsChanged', handleAccountsUpdate);
    window.ethereum.on('chainChanged', handleChainUpdate);

    return () => {
      console.log("Cleaning up wallet event listeners");
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsUpdate);
        window.ethereum.removeListener('chainChanged', handleChainUpdate);
      }
    };
  }, [handleAccountsUpdate, handleChainUpdate]);
};