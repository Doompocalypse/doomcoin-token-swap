import { useState, useEffect } from "react";

export const useWalletEvents = (
  onConnect: (connected: boolean, account?: string) => void,
  setChainId: (chainId: string) => void,
  setAccounts: (accounts: string[]) => void
) => {
  useEffect(() => {
    const handleAccountsUpdate = (newAccounts: string[]) => {
      console.log("Accounts update event:", newAccounts);
      setAccounts(newAccounts);
      if (newAccounts.length > 0) {
        onConnect(true, newAccounts[0]);
      } else {
        onConnect(false);
      }
    };

    const handleChainUpdate = async (newChainId: string) => {
      console.log("Chain ID updated:", newChainId);
      setChainId(newChainId);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsUpdate);
      window.ethereum.on('chainChanged', handleChainUpdate);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsUpdate);
        window.ethereum.removeListener('chainChanged', handleChainUpdate);
      };
    }
  }, [onConnect, setChainId, setAccounts]);
};