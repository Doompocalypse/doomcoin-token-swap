import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSDK } from "@metamask/sdk-react";

interface WalletContextType {
  connectWallet: (walletType?: string) => void;
  disconnectWallet: () => void;
  forceDisconnectWallet: () => void;
  accounts: string[];
  chainId?: string;
  walletAddress: string;
}

interface WalletProviderProps {
  children: React.ReactNode;
  onConnect: (connected: boolean, account?: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<WalletProviderProps> = ({ children, onConnect }) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { toast } = useToast();
  const { sdk, connected, chainId } = useSDK();

  // Prevent auto-connection by checking localStorage
  useEffect(() => {
    const wasDisconnected = localStorage.getItem("wallet_disconnected") === "true";
    if (wasDisconnected || !connected) {
      console.log("Previous session was disconnected or not connected, preventing auto-connection");
      setAccounts([]);
      onConnect(false);
    }
  }, [connected, onConnect]);

  // Clear connection if user manually disconnected from MetaMask
  useEffect(() => {
    if (!connected && accounts.length > 0) {
      console.log("MetaMask disconnected externally, updating state");
      setAccounts([]);
      onConnect(false);
    }
  }, [connected, accounts, onConnect]);

  console.log("WalletContext state:", { accounts, chainId, connected });

  const disconnectWallet = async () => {
    try {
      console.log("Starting wallet disconnection process...");
      
      localStorage.setItem("wallet_disconnected", "true");
      setAccounts([]);
      onConnect(false);
      
      if (window.ethereum?.isWalletConnect) {
        try {
          await window.ethereum.disconnect();
          console.log("WalletConnect disconnected");
        } catch (error) {
          console.error("Error disconnecting WalletConnect:", error);
        }
      }

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
      });

      console.log("Wallet disconnected successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const forceDisconnectWallet = async () => {
    try {
      console.log("Starting force wallet disconnection process...");
      
      localStorage.setItem("wallet_disconnected", "true");
      setAccounts([]);
      onConnect(false);

      if (window.ethereum) {
        const events = ["accountsChanged", "chainChanged", "connect", "disconnect"];
        events.forEach((event) => {
          window.ethereum?.removeListener(event, () => {});
        });
        console.log("Removed all network event listeners");
      }

      if (window.localStorage) {
        const walletKeys = Object.keys(window.localStorage).filter(
          (key) =>
            key.toLowerCase().includes("wallet") ||
            key.toLowerCase().includes("web3") ||
            key.toLowerCase().includes("metamask") ||
            key.toLowerCase().includes("wc@")
        );

        walletKeys.forEach((key) => {
          window.localStorage.removeItem(key);
        });
        console.log("Cleared all wallet-related local storage data");
      }

      toast({
        title: "Wallet Force Disconnected",
        description: "Your wallet has been forcefully disconnected from the application.",
      });

      console.log("Wallet force disconnected successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error force disconnecting wallet:", error);
      toast({
        title: "Error",
        description: "Failed to force disconnect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const connectWallet = async (walletType?: string) => {
    if (typeof window === "undefined") return;

    try {
      console.log("Requesting accounts...");
      
      // Request accounts without options to match TypeScript definition
      const newAccounts = await sdk?.connect();
      
      console.log("New accounts received:", newAccounts);

      if (newAccounts && newAccounts.length > 0) {
        localStorage.removeItem("wallet_disconnected"); // Clear disconnected flag on successful connection
        setAccounts(newAccounts);
        setWalletAddress(newAccounts[0]);
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
    <WalletContext.Provider
      value={{ 
        walletAddress, 
        accounts, 
        chainId: chainId?.toString(), 
        connectWallet, 
        disconnectWallet, 
        forceDisconnectWallet 
      }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
