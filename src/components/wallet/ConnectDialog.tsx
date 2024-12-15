import { Wallet, Wallet2, CreditCard, Smartphone } from "lucide-react";
import DialogLayout from "./dialog/DialogLayout";
import WalletButton from "./buttons/WalletButton";
import { useWeb3Modal } from '@web3modal/react';

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
  const { open } = useWeb3Modal();
  
  console.log("ConnectDialog render, isConnecting:", isConnecting, "connectionType:", connectionType);
  
  const handleCoinbaseConnect = async () => {
    try {
      await open({ view: 'Connect', uri: 'coinbase' });
    } catch (error) {
      console.error("Coinbase connection error:", error);
    }
  };

  const handleTrustWalletConnect = async () => {
    try {
      await open({ view: 'Connect', uri: 'trust' });
    } catch (error) {
      console.error("Trust Wallet connection error:", error);
    }
  };

  const handleRainbowConnect = async () => {
    try {
      await open({ view: 'Connect', uri: 'rainbow' });
    } catch (error) {
      console.error("Rainbow connection error:", error);
    }
  };
  
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
        onClick={handleCoinbaseConnect}
        isConnecting={isConnecting}
        isActive={connectionType === "walletconnect"}
        icon={CreditCard}
        title="Coinbase Wallet"
        description="Connect using Coinbase Wallet"
      />
      <WalletButton
        onClick={handleTrustWalletConnect}
        isConnecting={isConnecting}
        isActive={connectionType === "walletconnect"}
        icon={Smartphone}
        title="Trust Wallet"
        description="Connect using Trust Wallet"
      />
      <WalletButton
        onClick={handleRainbowConnect}
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