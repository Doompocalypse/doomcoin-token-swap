import React, { createContext, useContext, useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";
import { useWalletConnection } from "@/hooks/wallet/useWalletConnection";

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
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { connected } = useSDK();
  
  const {
    accounts,
    chainId,
    connectWallet,
    disconnectWallet,
    forceDisconnectWallet
  } = useWalletConnection(onConnect);

  // Prevent auto-connection by checking localStorage
  useEffect(() => {
    const wasDisconnected = localStorage.getItem("wallet_disconnected") === "true";
    if (wasDisconnected || !connected) {
      console.log("Previous session was disconnected or not connected, preventing auto-connection");
      onConnect(false);
    }
  }, [connected, onConnect]);

  // Update wallet address when accounts change
  useEffect(() => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
    } else {
      setWalletAddress("");
    }
  }, [accounts]);

  console.log("WalletContext state:", { accounts, chainId, connected });

  return (
    <WalletContext.Provider
      value={{ 
        walletAddress, 
        accounts, 
        chainId, 
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