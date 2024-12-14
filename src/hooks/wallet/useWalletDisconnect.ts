import { useToast } from "@/hooks/use-toast";

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
      
      // Set disconnected flag FIRST to prevent auto-reconnection
      localStorage.setItem('wallet_disconnected', 'true');
      
      // Clear local state immediately
      setAccounts([]);
      onConnect(false);
      
      // Remove network event listeners
      if (window.ethereum) {
        const events = ['accountsChanged', 'chainChanged', 'connect', 'disconnect'];
        events.forEach(event => {
          window.ethereum?.removeListener(event, () => {});
        });
        console.log("Removed Arbitrum network event listeners");
      }

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected from Arbitrum One.",
      });
      
      console.log("Wallet disconnected successfully from Arbitrum One");
      
      // Force reload the page to ensure clean state
      window.location.reload();
      
    } catch (error) {
      console.error("Error disconnecting wallet from Arbitrum One:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet from Arbitrum One. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { disconnectWallet };
};