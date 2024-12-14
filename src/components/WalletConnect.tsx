import { useState } from "react";
import { useWalletConnection } from "@/hooks/wallet/useWalletConnection";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import ConnectDialog from "./wallet/ConnectDialog";
import AccountDialog from "./wallet/AccountDialog";
import { Dialog } from "@/components/ui/dialog";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, forceDisconnectWallet, accounts, chainId } = useWalletConnection(onConnect);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    setDialogOpen(false);
  };

  const handleConnectWalletConnect = async () => {
    console.log("Connecting WalletConnect...");
    await connectWallet("walletconnect");
    setDialogOpen(false);
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <ConnectDialog
        onConnectMetaMask={handleConnectMetaMask}
        onConnectWalletConnect={handleConnectWalletConnect}
      />
    </Dialog>
  );
};

export default WalletConnect;