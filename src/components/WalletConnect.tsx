import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { SUPPORTED_CHAINS } from "@/utils/chainConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, disconnectWallet, accounts, chainId } = useWalletConnection(onConnect);

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

  if (accounts.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#33C3F0] hover:opacity-90">
            {formatAddress(accounts[0])}{getNetworkName()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={disconnectWallet}>
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connectWallet} className="bg-[#33C3F0] hover:opacity-90">
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;