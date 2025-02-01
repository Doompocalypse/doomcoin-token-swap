import { useState, useEffect, createContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

interface WalletContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletConnection = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();

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

  return {
    accounts,
    chainId,
    connectWallet,
    disconnectWallet,
    forceDisconnectWallet,
  };
};
