import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { SUPPORTED_CHAINS } from "@/utils/chainConfig";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, accounts, chainId } = useWalletConnection(onConnect);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = () => {
    if (!chainId) return "";
    
    console.log("Current chainId:", chainId);
    
    // Normalize chainId to string format
    const normalizedChainId = chainId.toString().toLowerCase();
    
    // Check for Ethereum Mainnet
    if (normalizedChainId === "0x1" || normalizedChainId === "1") {
      console.log("✅ Connected to Ethereum Mainnet");
      return " (Ethereum)";
    }
    
    // For other networks, just show a generic label
    return "";
  };

  return (
    <Button onClick={connectWallet} className="bg-[#33C3F0] hover:opacity-90">
      {accounts.length > 0 
        ? `${formatAddress(accounts[0])}${getNetworkName()}`
        : "Connect Wallet"
      }
    </Button>
  );
};

export default WalletConnect;