import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet } = useWalletConnection(onConnect);

  return (
    <Button onClick={connectWallet} className="bg-[#33C3F0] hover:opacity-90">
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;