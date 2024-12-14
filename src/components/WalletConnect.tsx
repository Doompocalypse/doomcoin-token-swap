import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, accounts } = useWalletConnection(onConnect);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Button onClick={connectWallet} className="bg-[#33C3F0] hover:opacity-90">
      {accounts.length > 0 ? formatAddress(accounts[0]) : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnect;