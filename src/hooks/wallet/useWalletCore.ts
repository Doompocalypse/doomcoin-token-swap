import { useState } from "react";

export const useWalletCore = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();

  const handleAccountsUpdate = (newAccounts: string[]) => {
    console.log("Accounts update event:", newAccounts);
    setAccounts(newAccounts);
    if (newAccounts.length > 0) {
      onConnect(true, newAccounts[0]);
    } else {
      onConnect(false);
    }
  };

  const handleChainUpdate = (newChainId: string) => {
    console.log("Chain ID updated:", newChainId);
    setChainId(newChainId);
  };

  return {
    accounts,
    chainId,
    setAccounts,
    setChainId,
    handleAccountsUpdate,
    handleChainUpdate,
  };
};