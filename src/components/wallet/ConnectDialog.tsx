import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, Wallet2 } from "lucide-react";

interface ConnectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectMetaMask: () => Promise<void>;
  onConnectWalletConnect: () => Promise<void>;
}

const ConnectDialog = ({
  isOpen,
  onOpenChange,
  onConnectMetaMask,
  onConnectWalletConnect,
}: ConnectDialogProps) => {
  console.log("ConnectDialog render - isOpen:", isOpen);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={onConnectMetaMask}
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
            onClick={onConnectWalletConnect}
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

export default ConnectDialog;