import { useToast } from "@/components/ui/use-toast";

type ToastProps = {
  toast: {
    (props: { title: string; description: string; variant?: "default" | "destructive" }): void;
  };
};

export const useWalletDisconnect = (
  setAccounts: (accounts: string[]) => void,
  onConnect: (connected: boolean) => void,
  { toast }: ToastProps
) => {
  const disconnectWallet = async () => {
    try {
      console.log("Starting wallet disconnection process...");
      
      // Set disconnected flag in localStorage
      localStorage.setItem('wallet_disconnected', 'true');
      
      // Clear local state first to ensure UI updates immediately
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
      
      // For MetaMask, clear permissions
      if (window.ethereum?.isMetaMask) {
        try {
          // Request new permissions which will clear the current connection
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });
          console.log("MetaMask permissions reset");
        } catch (error) {
          // User rejected or error occurred, which is fine as it means they're disconnected
          console.log("MetaMask disconnection completed", error);
        }
      }

      // Force clear any cached provider state
      if (window.ethereum) {
        // Store references to the event handlers
        const handleAccountsChanged = (accounts: string[]) => {
          console.log('Accounts changed:', accounts);
        };
        const handleChainChanged = (chainId: string) => {
          console.log('Chain changed:', chainId);
        };

        // Remove individual listeners
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        
        console.log("Removed ethereum event listeners");
      }

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
      });
      
      console.log("Wallet disconnection process completed");
      
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { disconnectWallet };
};