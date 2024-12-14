import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [connecting, setConnecting] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const { toast } = useToast();

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (newAccounts: string[]) => {
        console.log("MetaMask accounts changed:", newAccounts);
        setAccounts(newAccounts);
        if (newAccounts.length === 0) {
          onConnect(false);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
            variant: "destructive",
          });
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(console.error);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [onConnect, toast]);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        console.log("Requesting accounts from MetaMask...");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Received accounts from MetaMask:", accounts);
        setAccounts(accounts);
        
        if (accounts.length === 1) {
          // If only one account, connect directly
          handleAccountSelect(accounts[0]);
        } else if (accounts.length > 1) {
          // If multiple accounts, show selection dialog
          setShowAccountDialog(true);
        }
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
    onConnect(true, account);
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