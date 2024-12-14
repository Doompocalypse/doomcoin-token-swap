import { useEffect, useCallback } from "react";

export const useInitialConnection = (
  setAccounts: (accounts: string[]) => void,
  setChainId: (chainId: string) => void,
  onConnect: (connected: boolean, account?: string) => void
) => {
  const checkConnection = useCallback(async () => {
    console.log("Starting fresh connection state...");
    
    // Clear any existing connections
    setAccounts([]);
    onConnect(false);
    
    // Clear any cached permissions if MetaMask is present
    if (window.ethereum?.isMetaMask) {
      try {
        console.log("Clearing cached MetaMask permissions...");
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }]
        });
      } catch (error) {
        console.log("No permissions to revoke or error:", error);
      }
    }

    // Only get chain ID for reference, but don't connect
    if (window.ethereum) {
      try {
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        console.log("Current chain ID:", currentChainId);
        setChainId(currentChainId);
      } catch (error) {
        console.error("Error checking chain:", error);
      }
    } else {
      console.log("No Web3 wallet detected");
    }
  }, [setAccounts, setChainId, onConnect]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);
};