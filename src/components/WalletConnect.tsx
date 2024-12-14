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
    
    // Convert chainId to lowercase for consistent comparison
    const normalizedChainId = chainId.toLowerCase();
    console.log("Normalized chainId:", normalizedChainId);
    
    // Handle Ethereum Mainnet
    if (normalizedChainId === "0x1") {
      console.log("Detected Ethereum Mainnet");
      return " (Ethereum Mainnet)";
    }
    
    // Handle other supported chains
    const chain = SUPPORTED_CHAINS[normalizedChainId];
    if (chain) {
      console.log("Found supported chain:", chain.chainName);
      return ` (${chain.chainName})`;
    }
    
    // Fallback for unknown chains
    console.log("Unknown chain ID:", chainId);
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