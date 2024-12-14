import { useState } from "react";
import { useWalletConnection } from "@/hooks/wallet/useWalletConnection";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import ConnectDialog from "./wallet/ConnectDialog";
import AccountDialog from "./wallet/AccountDialog";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, forceDisconnectWallet, accounts, chainId } = useWalletConnection(onConnect);
  const [isOpen, setIsOpen] = useState(false);

  const getNetworkName = () => {
    if (!chainId) return "";
    
    console.log("Current chainId:", chainId);
    
    const normalizedChainId = chainId.toString().toLowerCase();
    
    if (normalizedChainId === ARBITRUM_CHAIN_ID.toLowerCase()) {
      console.log("✅ Connected to Arbitrum One");
      return " (Arbitrum)";
    }
    
    console.warn("Connected to unsupported network:", normalizedChainId);
    return " (Wrong Network)";
  };

  const handleConnectMetaMask = async () => {
    console.log("Connecting MetaMask...");
    await connectWallet("metamask");
    setIsOpen(false);
  };

  const handleConnectWalletConnect = async () => {
    console.log("Connecting WalletConnect...");
    await connectWallet("walletconnect");
    setIsOpen(false);
  };

  const handleSwitchAccount = async (account: string) => {
    console.log("Switching to account:", account);
    await connectWallet(undefined, account);
  };

  if (accounts && accounts.length > 0) {
    return (
      <AccountDialog
        accounts={accounts}
        networkName={getNetworkName()}
        onSwitchAccount={handleSwitchAccount}
        onDisconnect={forceDisconnectWallet}
      />
    );
  }

  return (
    <ConnectDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConnectMetaMask={handleConnectMetaMask}
      onConnectWalletConnect={handleConnectWalletConnect}
    />
  );
};

export default WalletConnect;