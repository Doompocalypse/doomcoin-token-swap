import { Wallet, Wallet2 } from "lucide-react";
import DialogLayout from "./dialog/DialogLayout";
import WalletButton from "./buttons/WalletButton";

interface ConnectDialogProps {
  onConnectMetaMask: () => Promise<void>;
  onConnectWalletConnect: () => Promise<void>;
  isConnecting: boolean;
  connectionType: "metamask" | "walletconnect" | null;
}

const ConnectDialog = ({
  onConnectMetaMask,
  onConnectWalletConnect,
  isConnecting,
  connectionType,
}: ConnectDialogProps) => {
  console.log("ConnectDialog render, isConnecting:", isConnecting, "connectionType:", connectionType);
  
  return (
    <DialogLayout>
      <WalletButton
        onClick={onConnectMetaMask}
        isConnecting={isConnecting}
        isActive={connectionType === "metamask"}
        icon={Wallet}
        title="MetaMask"
        description="Connect using browser wallet"
      />
      <WalletButton
        onClick={onConnectWalletConnect}
        isConnecting={isConnecting}
        isActive={connectionType === "walletconnect"}
        icon={Wallet2}
        title="WalletConnect"
        description="Connect using WalletConnect"
      />
    </DialogLayout>
  );
};

export default ConnectDialog;