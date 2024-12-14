import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface WalletConnectProps {
  onConnect: (connected: boolean) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Wallet connected:", accounts[0]);
        onConnect(true);
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

  return (
    <div className="gradient-border">
      <Button
        onClick={connectWallet}
        disabled={connecting}
        className="bg-background hover:bg-secondary transition-colors"
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default WalletConnect;