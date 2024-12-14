import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // Clear any existing accounts first
          setAccounts([]);
          
          // Request accounts to ensure we get the user's accounts
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          console.log("Checking for existing accounts:", accounts);
          
          if (accounts.length > 0) {
            setAccounts(accounts);
            onConnect(true, accounts[0]);
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
          setAccounts([]);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        console.log("Accounts changed:", newAccounts);
        setAccounts(newAccounts);
        if (newAccounts.length > 0) {
          onConnect(true, newAccounts[0]);
        } else {
          onConnect(false);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {
          console.log("Removed accounts changed listener");
        });
      }
    };
  }, [onConnect]);

  const handleConnect = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Requesting accounts...");
      // Clear existing accounts
      setAccounts([]);
      
      // Request new accounts
      const newAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("New accounts received:", newAccounts);
      setAccounts(newAccounts);
      setShowAccountDialog(true);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      });
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
      <Button onClick={handleConnect} className="bg-[#33C3F0] hover:opacity-90">
        Connect Wallet
      </Button>

      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Account</DialogTitle>
            <DialogDescription>
              Choose which MetaMask account to connect
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {accounts.length === 0 ? (
              <p className="text-sm text-gray-500">No accounts found. Please make sure MetaMask is unlocked.</p>
            ) : (
              accounts.map((account) => (
                <Button
                  key={account}
                  onClick={() => handleAccountSelect(account)}
                  variant="outline"
                  className="w-full justify-between"
                >
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnect;