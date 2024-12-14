import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          console.log("Existing accounts found:", accounts);
          if (accounts.length > 0) {
            setAccounts(accounts);
            onConnect(true, accounts[0]);
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
        }
      }
    };

    checkConnection();
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
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Accounts received:", accounts);
      setAccounts(accounts);
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
          </DialogHeader>
          <div className="space-y-2">
            {accounts.map((account) => (
              <Button
                key={account}
                onClick={() => handleAccountSelect(account)}
                variant="outline"
                className="w-full justify-between"
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