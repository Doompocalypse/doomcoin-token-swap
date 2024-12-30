import { useEffect } from "react";

export const useWalletEvents = (
  onConnect: (connected: boolean, account?: string) => void,
  handleAccountsUpdate: (accounts: string[]) => void,
  handleChainUpdate: (chainId: string) => void
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
        
        handleChainUpdate(currentChainId);
        
        if (currentAccounts.length > 0) {
          handleAccountsUpdate(currentAccounts);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsUpdate);
      window.ethereum.on('chainChanged', handleChainUpdate);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsUpdate);
        window.ethereum.removeListener('chainChanged', handleChainUpdate);
      };
    }
  }, [onConnect, handleAccountsUpdate, handleChainUpdate]);
};