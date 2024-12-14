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
    connectMetaMask,
    connectWalletConnect
  } = useWalletCore(onConnect);

  useWalletEvents(onConnect, setChainId, setAccounts);
  
  const { disconnectWallet, forceDisconnectWallet } = useWalletDisconnect(
    setAccounts,
    onConnect
  );

  const connectWallet = async (walletType?: "metamask" | "walletconnect", selectedAccount?: string) => {
    console.log("Connecting wallet with type:", walletType);
    
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
      await connectWalletConnect();
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