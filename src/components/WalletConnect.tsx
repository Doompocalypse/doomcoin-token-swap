import { useState } from "react";
import { useWalletConnection } from "@/hooks/wallet/useWalletConnection";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import ConnectDialog from "./wallet/ConnectDialog";
import AccountDialog from "./wallet/AccountDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, forceDisconnectWallet, accounts, chainId } = useWalletConnection(onConnect);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionType, setConnectionType] = useState<"metamask" | "walletconnect" | null>(null);

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
    try {
      setIsConnecting(true);
      setConnectionType("metamask");
      console.log("Connecting MetaMask...");
      await connectWallet("metamask");
      setDialogOpen(false);
    } finally {
      setIsConnecting(false);
      setConnectionType(null);
    }
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
      <DialogTrigger asChild>
        <Button 
          className="bg-white text-black hover:bg-white/90"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      </DialogTrigger>
      <ConnectDialog
        onConnectMetaMask={handleConnectMetaMask}
        isConnecting={isConnecting}
        connectionType={connectionType}
      />
    </Dialog>
  );
};

export default WalletConnect;