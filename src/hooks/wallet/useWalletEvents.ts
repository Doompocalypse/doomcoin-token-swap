import { useEffect, useCallback, useRef } from "react";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useWalletEvents = (
  onConnect: (connected: boolean, account?: string) => void,
  setChainId: (chainId: string) => void,
  setAccounts: (accounts: string[]) => void
) => {
  // Use refs to maintain stable references to the setter functions
  const onConnectRef = useRef(onConnect);
  const setChainIdRef = useRef(setChainId);
  const setAccountsRef = useRef(setAccounts);

  // Update refs when dependencies change
  useEffect(() => {
    onConnectRef.current = onConnect;
    setChainIdRef.current = setChainId;
    setAccountsRef.current = setAccounts;
  }, [onConnect, setChainId, setAccounts]);

  const handleAccountsUpdate = useCallback((newAccounts: string[]) => {
    console.log("Accounts update event:", newAccounts);
    setAccountsRef.current(newAccounts);
    if (newAccounts.length > 0) {
      onConnectRef.current(true, newAccounts[0]);
    } else {
      onConnectRef.current(false);
    }
  }, []);

  const handleChainUpdate = useCallback((newChainId: string) => {
    console.log("Chain ID updated:", newChainId);
    setChainIdRef.current(newChainId);
    
    // If the new chain is not Arbitrum One, disconnect
    if (newChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase()) {
      console.log("Switched away from Arbitrum One, disconnecting");
      setAccountsRef.current([]);
      onConnectRef.current(false);
    }
  }, []);

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