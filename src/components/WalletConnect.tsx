import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/wallet/useWalletConnection";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import { detectWalletProviders } from "@/utils/walletProviders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Wallet } from "lucide-react";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, forceDisconnectWallet, accounts, chainId } = useWalletConnection(onConnect);
  const providers = detectWalletProviders();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = () => {
    if (!chainId) return "";
    
    console.log("Current chainId:", chainId);
    
    const normalizedChainId = chainId.toString().toLowerCase();
    
    if (normalizedChainId === ARBITRUM_CHAIN_ID.toLowerCase()) {
      console.log("✅ Connected to Arbitrum One");
      return " (Arbitrum)";
    }
    
    console.warn("Connected to unsupported network:", normalizedChainId);
    return " (Wrong Network)";
  };

  const handleConnectMetaMask = async () => {
    console.log("Connecting MetaMask...");
    await connectWallet("metamask");
  };

  const handleConnectCoinbase = async () => {
    console.log("Connecting Coinbase Wallet...");
    await connectWallet("coinbase");
  };

  if (accounts && accounts.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-white text-black hover:bg-white/90">
            {formatAddress(accounts[0])}{getNetworkName()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border-none">
          {accounts.length > 1 && (
            <>
              <div className="px-2 py-1.5 text-sm font-semibold">Switch Account</div>
              {accounts.map((account, index) => (
                <DropdownMenuItem
                  key={account}
                  onClick={() => connectWallet(undefined, account)}
                  className="cursor-pointer"
                >
                  Account {index + 1}: {formatAddress(account)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={forceDisconnectWallet} className="cursor-pointer text-red-500">
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white text-black hover:bg-white/90">
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-none">
        {providers.isMetaMask && (
          <DropdownMenuItem 
            onClick={handleConnectMetaMask} 
            className="cursor-pointer bg-white text-black hover:bg-white/90 border-none"
          >
            <Wallet className="mr-2 h-4 w-4" />
            MetaMask
          </DropdownMenuItem>
        )}
        {providers.isCoinbaseWallet && (
          <DropdownMenuItem 
            onClick={handleConnectCoinbase} 
            className="cursor-pointer bg-white text-black hover:bg-white/90 border-none"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Coinbase Wallet
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnect;