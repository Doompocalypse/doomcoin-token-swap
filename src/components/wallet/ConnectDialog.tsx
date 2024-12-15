import { Wallet, Wallet2, CreditCard, Smartphone } from "lucide-react";
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
        icon={CreditCard}
        title="Coinbase Wallet"
        description="Connect using Coinbase Wallet"
      />
      <WalletButton
        onClick={onConnectWalletConnect}
        isConnecting={isConnecting}
        isActive={connectionType === "walletconnect"}
        icon={Smartphone}
        title="Trust Wallet"
        description="Connect using Trust Wallet"
      />
      <WalletButton
        onClick={onConnectWalletConnect}
        isConnecting={isConnecting}
        isActive={connectionType === "walletconnect"}
        icon={Wallet2}
        title="Rainbow"
        description="Connect using Rainbow Wallet"
      />
    </DialogLayout>
  );
};

export default ConnectDialog;