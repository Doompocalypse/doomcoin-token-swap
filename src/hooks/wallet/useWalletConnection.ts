import { useWalletCore } from "./useWalletCore";
import { useWalletEvents } from "./useWalletEvents";
import { useWalletDisconnect } from "./useWalletDisconnect";
import { useToast } from "@/hooks/use-toast";

export const useWalletConnection = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const {
    accounts,
    chainId,
    handleAccountsUpdate,
    handleChainUpdate,
    toast
  } = useWalletCore(onConnect);

  useWalletEvents(onConnect, handleAccountsUpdate, handleChainUpdate);
  
  const { disconnectWallet, forceDisconnectWallet } = useWalletDisconnect(
    () => handleAccountsUpdate([]),
    onConnect
  );

  const connectWallet = async (walletType?: "metamask" | "walletconnect", selectedAccount?: string) => {
    console.log("Connecting wallet with type:", walletType);
    
    if (selectedAccount && accounts.includes(selectedAccount)) {
      console.log("Switching to selected account:", selectedAccount);
      handleAccountsUpdate([selectedAccount]);
      return;
    }

    if (!window.ethereum) {
      console.log("No Web3 wallet detected, opening WalletConnect modal");
      const wcProjectId = "0d63e4b93b8abc2ea0a58328d7e7c053";
      const wcModal = document.createElement('w3m-core');
      wcModal.setAttribute('project-id', wcProjectId);
      wcModal.setAttribute('theme', 'dark');
      document.body.appendChild(wcModal);
      return;
    }

    try {
      console.log("Requesting accounts...");
      const newAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("New accounts received:", newAccounts);
      if (newAccounts.length > 0) {
        handleAccountsUpdate(newAccounts);
        toast({
          title: "Wallet Connected",
          description: `Connected to account: ${newAccounts[0].slice(0, 6)}...${newAccounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    accounts,
    chainId,
    connectWallet,
    disconnectWallet,
    forceDisconnectWallet
  };
};