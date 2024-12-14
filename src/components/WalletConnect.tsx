import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/wallet/useWalletConnection";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Wallet, WalletConnect as WalletConnectIcon } from "lucide-react";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, forceDisconnectWallet, accounts, chainId } = useWalletConnection(onConnect);

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

  const handleConnectWalletConnect = async () => {
    console.log("Connecting WalletConnect...");
    await connectWallet("walletconnect");
  };

  if (accounts && accounts.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#33C3F0] hover:opacity-90">
            {formatAddress(accounts[0])}{getNetworkName()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
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
        <Button className="bg-[#33C3F0] hover:opacity-90">
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleConnectMetaMask} className="cursor-pointer">
          <Wallet className="mr-2 h-4 w-4" />
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleConnectWalletConnect} className="cursor-pointer">
          <WalletConnectIcon className="mr-2 h-4 w-4" />
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnect;