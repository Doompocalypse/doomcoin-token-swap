import { useEffect } from "react";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useInitialConnection = (
  setAccounts: (accounts: string[]) => void,
  setChainId: (chainId: string) => void,
  onConnect: (connected: boolean, account?: string) => void
) => {
  useEffect(() => {
    const checkConnection = async () => {
      // Always start with a disconnected state on page load
      console.log("Starting with disconnected state on page load");
      setAccounts([]);
      onConnect(false);
      
      // Don't proceed with connection checks
      if (!window.ethereum) {
        console.log("No Web3 wallet detected");
        return;
      }

      try {
        // Still get the chain ID for reference
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        console.log("Current chain ID:", currentChainId);
        setChainId(currentChainId);
      } catch (error) {
        console.error("Error checking chain:", error);
        setAccounts([]);
        onConnect(false);
      }
    };

    checkConnection();
  }, [setAccounts, setChainId, onConnect]);
};