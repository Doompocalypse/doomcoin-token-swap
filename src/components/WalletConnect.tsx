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
    console.log("Type of chainId:", typeof chainId);
    
    // Direct check for Ethereum Mainnet
    if (chainId === "0x1" || chainId === "1" || chainId === 1) {
      console.log("✅ Ethereum Mainnet detected");
      return " (Ethereum Mainnet)";
    }
    
    // Convert chainId to hex if it's a number
    const hexChainId = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
    console.log("Converted hexChainId:", hexChainId);
    
    // Check supported chains
    const chain = SUPPORTED_CHAINS[hexChainId];
    if (chain) {
      console.log("Found chain configuration:", chain);
      return ` (${chain.chainName})`;
    }
    
    console.log("❌ Unknown network:", chainId);
    return ` (Unknown Network)`;
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