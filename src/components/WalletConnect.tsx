import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WalletConnectProps {
  onConnect: (connected: boolean) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [connecting, setConnecting] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Available accounts:", accounts);
        setAccounts(accounts);
        setShowAccountDialog(true);
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

  const handleAccountSelect = (account: string) => {
    console.log("Selected account:", account);
    onConnect(true);
    setShowAccountDialog(false);
    toast({
      title: "Account Connected",
      description: `Connected to account: ${account.slice(0, 6)}...${account.slice(-4)}`,
    });
  };

  return (
    <>
      <div className="gradient-border">
        <Button
          onClick={connectWallet}
          disabled={connecting}
          className="bg-background hover:bg-secondary transition-colors"
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>

      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {accounts.map((account) => (
              <Button
                key={account}
                onClick={() => handleAccountSelect(account)}
                variant="outline"
                className="w-full justify-start font-mono"
              >
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnect;