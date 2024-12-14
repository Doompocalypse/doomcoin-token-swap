import { useEffect } from "react";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useWalletEvents = (
  onConnect: (connected: boolean, account?: string) => void,
  setChainId: (chainId: string) => void,
  setAccounts: (accounts: string[]) => void
) => {
  useEffect(() => {
    const handleAccountsUpdate = (newAccounts: string[]) => {
      console.log("Accounts update event on Arbitrum One:", newAccounts);
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
      
      // If the new chain is not Arbitrum One, disconnect
      if (newChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase()) {
        console.log("Switched away from Arbitrum One, disconnecting");
        setAccounts([]);
        onConnect(false);
      }
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