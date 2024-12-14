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
    
    console.log("Raw chainId:", chainId);
    
    // Special handling for Ethereum Mainnet
    if (chainId === "0x1" || chainId === "1") {
      console.log("Detected Ethereum Mainnet");
      return " (Ethereum Mainnet)";
    }
    
    // For other networks, check the SUPPORTED_CHAINS mapping
    const chainKey = Object.keys(SUPPORTED_CHAINS).find(
      key => key.toLowerCase() === chainId.toLowerCase()
    );
    
    if (chainKey) {
      const network = SUPPORTED_CHAINS[chainKey].chainName;
      console.log("Detected network:", network);
      return ` (${network})`;
    }
    
    // Fallback for unknown networks
    console.log("Unknown network with chainId:", chainId);
    return ` (Chain ID: ${chainId})`;
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