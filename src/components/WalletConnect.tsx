import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/wallet/useWalletConnection";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, Wallet2 } from "lucide-react";
import { useState } from "react";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connectWallet, forceDisconnectWallet, accounts, chainId } = useWalletConnection(onConnect);
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };

  const handleConnectWalletConnect = async () => {
    console.log("Connecting WalletConnect...");
    await connectWallet("walletconnect");
    setIsOpen(false);
  };

  if (accounts && accounts.length > 0) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-white text-black hover:bg-white/90">
            {formatAddress(accounts[0])}{getNetworkName()}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-black/20 backdrop-blur-sm border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Connected Account</DialogTitle>
            <DialogDescription className="text-gray-200">
              You are connected with account {formatAddress(accounts[0])}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {accounts.length > 1 && (
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-white">Switch Account</div>
                {accounts.map((account, index) => (
                  <Button
                    key={account}
                    variant="outline"
                    onClick={() => connectWallet(undefined, account)}
                    className="w-full justify-start bg-white/10 text-white hover:bg-white/20"
                  >
                    Account {index + 1}: {formatAddress(account)}
                  </Button>
                ))}
              </div>
            )}
            <Button 
              onClick={forceDisconnectWallet} 
              variant="destructive"
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-white/90">
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black/20 backdrop-blur-sm border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-gray-200">
            Choose your preferred wallet to connect to our application. Make sure you're on the Arbitrum network.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={handleConnectMetaMask}
            variant="outline"
            className="w-full justify-start h-16 bg-white/10 text-white hover:bg-white/20"
          >
            <Wallet className="mr-4 h-6 w-6" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">MetaMask</span>
              <span className="text-sm text-gray-300">Connect using browser wallet</span>
            </div>
          </Button>
          <Button
            onClick={handleConnectWalletConnect}
            variant="outline"
            className="w-full justify-start h-16 bg-white/10 text-white hover:bg-white/20"
          >
            <Wallet2 className="mr-4 h-6 w-6" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">WalletConnect</span>
              <span className="text-sm text-gray-300">Connect using WalletConnect</span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;