import { Wallet } from "lucide-react";
import DialogLayout from "./dialog/DialogLayout";
import WalletButton from "./buttons/WalletButton";

interface ConnectDialogProps {
  onConnectMetaMask: () => Promise<void>;
  isConnecting: boolean;
  connectionType: "metamask" | "walletconnect" | null;
}

const ConnectDialog = ({
  onConnectMetaMask,
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
    </DialogLayout>
  );
};

export default ConnectDialog;