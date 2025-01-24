import { Button } from "@/components/ui/button";
import { useWallet } from "../contexts/WalletContext";
import { getNetworkName, isSupportedChain } from "@/utils/chainConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Wallet } from "lucide-react";

const WalletConnect = () => {
  const { connectWallet, forceDisconnectWallet, accounts, chainId } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkDisplay = () => {
    if (!chainId) return "";

    console.log("Current chainId:", chainId);

    const networkName = getNetworkName(chainId);
    const isSupported = isSupportedChain(chainId);

    if (isSupported) {
      console.log(`✅ Connected to ${networkName}`);
      return ` (${networkName})`;
    }

    console.warn("Connected to unsupported network:", chainId);
    return " (Wrong Network)";
  };

  if (accounts && accounts.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-white text-black hover:bg-white/90">
            {formatAddress(accounts[0])}
            {getNetworkDisplay()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border-none">
          {accounts.length > 1 && (
            <>
              <div className="px-2 py-1.5 text-sm font-semibold">Switch Account</div>
              {accounts.map((account, index) => (
                <DropdownMenuItem key={account} className="cursor-pointer">
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
        <Button className="bg-white text-black hover:bg-white/90">Connect Wallet</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-none">
        <DropdownMenuItem
          onClick={() => connectWallet("metamask")}
          className="cursor-pointer bg-white text-black hover:bg-white/90 border-none">
          <Wallet className="mr-2 h-4 w-4" />
          MetaMask
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnect;