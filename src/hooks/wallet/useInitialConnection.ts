import { useEffect } from "react";

export const useInitialConnection = (
  setAccounts: (accounts: string[]) => void,
  setChainId: (chainId: string) => void,
  onConnect: (connected: boolean, account?: string) => void
) => {
  useEffect(() => {
    const checkConnection = async () => {
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
        
        if (currentAccounts.length > 0) {
          setAccounts(currentAccounts);
          onConnect(true, currentAccounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        setAccounts([]);
      }
    };

    checkConnection();
  }, [setAccounts, setChainId, onConnect]);
};