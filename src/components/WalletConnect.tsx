import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface WalletConnectProps {
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        console.log("MetaMask not installed");
        return;
      }

      try {
        const currentAccounts = await window.ethereum.request({ method: "eth_accounts" });
        console.log("Current connected accounts:", currentAccounts);
        
        if (currentAccounts.length > 0) {
          setAccounts(currentAccounts);
          onConnect(true, currentAccounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        setAccounts([]);
      }
    };

    checkConnection();

    const handleAccountsChanged = (newAccounts: string[]) => {
      console.log("Accounts changed:", newAccounts);
      setAccounts(newAccounts);
      if (newAccounts.length > 0) {
        onConnect(true, newAccounts[0]);
      } else {
        onConnect(false);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [onConnect]);

  const handleConnect = async () => {
    if (typeof window === 'undefined') return;

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
      // Force MetaMask to show the popup
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      
      const newAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("New accounts received:", newAccounts);
      if (newAccounts.length > 0) {
        setAccounts(newAccounts);
        onConnect(true, newAccounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected to account: ${newAccounts[0].slice(0, 6)}...${newAccounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleConnect} className="bg-[#33C3F0] hover:opacity-90">
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;