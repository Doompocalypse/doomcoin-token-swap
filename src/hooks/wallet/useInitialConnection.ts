import { useEffect, useCallback } from "react";

export const useInitialConnection = (
  setAccounts: (accounts: string[]) => void,
  setChainId: (chainId: string) => void,
  onConnect: (connected: boolean, account?: string) => void
) => {
  const checkConnection = useCallback(async () => {
    console.log("Starting fresh connection state...");
    
    if (!window.ethereum) {
      console.log("No Web3 wallet detected");
      setAccounts([]);
      onConnect(false);
      return;
    }

    try {
      // Get current accounts without clearing permissions
      const accounts = await window.ethereum.request({ 
        method: "eth_accounts" 
      });
      
      // Get current chain ID
      const chainId = await window.ethereum.request({ 
        method: "eth_chainId" 
      });
      
      console.log("Initial connection check:", { accounts, chainId });
      
      if (accounts && accounts.length > 0) {
        setAccounts(accounts);
        setChainId(chainId);
        onConnect(true, accounts[0]);
        console.log("Restored existing connection:", accounts[0]);
      } else {
        setAccounts([]);
        setChainId(chainId);
        onConnect(false);
        console.log("No active connection found");
      }
    } catch (error) {
      console.error("Error checking initial connection:", error);
      setAccounts([]);
      onConnect(false);
    }
  }, [setAccounts, setChainId, onConnect]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);
};