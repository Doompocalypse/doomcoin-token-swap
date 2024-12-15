import { useWalletCore } from "./useWalletCore";
import { useWalletEvents } from "./useWalletEvents";
import { useWalletDisconnect } from "./useWalletDisconnect";

export const useWalletConnection = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const {
    accounts,
    chainId,
    setAccounts,
    setChainId,
    connectMetaMask
  } = useWalletCore(onConnect);

  useWalletEvents(onConnect, setChainId, setAccounts);
  
  const { disconnectWallet, forceDisconnectWallet } = useWalletDisconnect(
    setAccounts,
    onConnect
  );

  const connectWallet = async (walletType?: "metamask" | "walletconnect", selectedAccount?: string) => {
    console.log("Connecting wallet with type:", walletType);
    
    // Clear any existing connections first
    await forceDisconnectWallet();
    
    // If switching between connected accounts
    if (selectedAccount && accounts.includes(selectedAccount)) {
      console.log("Switching to selected account:", selectedAccount);
      setAccounts([selectedAccount]);
      onConnect(true, selectedAccount);
      return;
    }

    if (walletType === "metamask") {
      await connectMetaMask();
    } else if (walletType === "walletconnect") {
      console.log("Opening WalletConnect modal");
      const wcProjectId = "0d63e4b93b8abc2ea0a58328d7e7c053";
      const wcModal = document.createElement('w3m-core');
      wcModal.setAttribute('project-id', wcProjectId);
      wcModal.setAttribute('theme', 'dark');
      document.body.appendChild(wcModal);
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