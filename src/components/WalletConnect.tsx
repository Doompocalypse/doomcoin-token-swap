import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet } from "lucide-react";

interface WalletConnectProps {
  onConnect: (connected: boolean) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const connectMetaMask = async () => {
    setConnecting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Wallet connected:", accounts[0]);
        onConnect(true);
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to MetaMask",
        });
      } else {
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask to connect your wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const connectWalletConnect = async () => {
    toast({
      title: "Coming Soon",
      description: "WalletConnect integration will be available soon",
    });
  };

  const connectCoinbase = async () => {
    toast({
      title: "Coming Soon",
      description: "Coinbase Wallet integration will be available soon",
    });
  };

  return (
    <div className="gradient-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={connecting}
            className="bg-background hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={connectMetaMask} className="cursor-pointer">
            MetaMask
          </DropdownMenuItem>
          <DropdownMenuItem onClick={connectWalletConnect} className="cursor-pointer">
            WalletConnect
          </DropdownMenuItem>
          <DropdownMenuItem onClick={connectCoinbase} className="cursor-pointer">
            Coinbase Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WalletConnect;