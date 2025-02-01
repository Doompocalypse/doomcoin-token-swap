import { useEffect, useCallback, useRef } from "react";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useWalletEvents = (setChainId: (chainId: string) => void, setAccounts: (accounts: string[]) => void) => {
  // Use refs to maintain stable references to the setter functions
  const onConnectRef = useRef();
  const setChainIdRef = useRef(setChainId);
  const setAccountsRef = useRef(setAccounts);

  // Update refs when dependencies change
  useEffect(() => {
    setChainIdRef.current = setChainId;
    setAccountsRef.current = setAccounts;
  }, [setChainId, setAccounts]);

  const handleAccountsUpdate = useCallback((newAccounts: string[]) => {
    console.log("Accounts update event:", newAccounts);
    setAccountsRef.current(newAccounts);
  }, []);

  const handleChainUpdate = useCallback((newChainId: string) => {
    console.log("Chain ID updated:", newChainId);
    setChainIdRef.current(newChainId);

    // If the new chain is not Arbitrum One, disconnect
    if (newChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase()) {
      console.log("Switched away from Arbitrum One, disconnecting");
      setAccountsRef.current([]);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) {
      console.log("No Web3 wallet detected in useWalletEvents");
      return;
    }

    console.log("Setting up wallet event listeners");
    window.ethereum.on("accountsChanged", handleAccountsUpdate);
    window.ethereum.on("chainChanged", handleChainUpdate);

    return () => {
      console.log("Cleaning up wallet event listeners");
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsUpdate);
        window.ethereum.removeListener("chainChanged", handleChainUpdate);
      }
    };
  }, [handleAccountsUpdate, handleChainUpdate]);
};
