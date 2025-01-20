import React, { createContext, useContext, useState, useEffect } from "react";
import { useWalletCore } from "../hooks/wallet/useWalletCore";
import { useToast } from "@/hooks/use-toast";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

interface WalletContextType {
  connectWallet: () => void;
  disconnectWallet: () => void;

  forceDisconnectWallet;
  accounts;
  chainId;
  walletAddress;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }, onConnect: (connected: boolean, account?: string) => void) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();

  console.log("WalletContext ", accounts);

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        console.log("No Web3 wallet detected");
        return;
      }

      try {
        const currentAccounts = await window.ethereum.request({ method: "eth_accounts" });
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        console.log("Current connected accounts:", currentAccounts);
        console.log("Current chain ID:", currentChainId);

        setChainId(currentChainId);

        if (currentAccounts.length > 0) {
          setAccounts(currentAccounts);
          setWalletAddress(currentAccounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        setAccounts([]);
      }
    };

    checkConnection();

    const handleAccountsUpdate = (newAccounts: string[]) => {
      console.log("Accounts update event:", newAccounts);
      setAccounts(newAccounts);
      if (newAccounts.length > 0) {
        onConnect(true, newAccounts[0]);
      } else {
        onConnect(false);
      }
    };

    const handleChainUpdate = async (newChainId: string) => {
      console.log("Chain ID updated:", newChainId);
      setChainId(newChainId);
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsUpdate);
      window.ethereum.on("chainChanged", handleChainUpdate);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsUpdate);
        window.ethereum.removeListener("chainChanged", handleChainUpdate);
      };
    }
  }, []);

  const disconnectWallet = async () => {
    try {
      console.log("Starting wallet disconnection process...");

      // Clear local state first
      setAccounts([]);
      onConnect(false);

      // For WalletConnect
      if (window.ethereum?.isWalletConnect) {
        try {
          await window.ethereum.disconnect();
          console.log("WalletConnect disconnected");
        } catch (error) {
          console.error("Error disconnecting WalletConnect:", error);
        }
      }

      // For MetaMask, request new permissions to force disconnect
      if (window.ethereum?.isMetaMask) {
        try {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });
          console.log("MetaMask permissions reset");
        } catch (error) {
          // User rejected the permission request, which effectively disconnects them
          console.log("User rejected connection after disconnect request");
        }
      }

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
      });

      console.log("Wallet disconnected successfully");

      // Force reload the page to ensure clean state
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

      // Set disconnected flag FIRST to prevent auto-reconnection
      localStorage.setItem("wallet_disconnected", "true");

      // Clear local state immediately
      setAccounts([]);
      onConnect(false);

      // Remove all event listeners
      if (window.ethereum) {
        const events = ["accountsChanged", "chainChanged", "connect", "disconnect"];
        events.forEach((event) => {
          window.ethereum?.removeListener(event, () => {});
        });
        console.log("Removed all network event listeners");
      }

      // Clear any cached provider data
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

      // Force reload the page to ensure clean state
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

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    if (!window.ethereum) {
      // Open WalletConnect modal
      const wcProjectId = "0d63e4b93b8abc2ea0a58328d7e7c053";
      const wcModal = document.createElement("w3m-core");
      wcModal.setAttribute("project-id", wcProjectId);
      wcModal.setAttribute("theme", "dark");
      document.body.appendChild(wcModal);

      toast({
        title: "Connect Wallet",
        description: "Please select a wallet to connect",
      });
      return;
    }

    try {
      console.log("Requesting accounts...");

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
    <WalletContext.Provider
      value={{ walletAddress, accounts, chainId, connectWallet, disconnectWallet, forceDisconnectWallet }}>
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
