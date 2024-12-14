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
      
      // Store event handler references so we can properly remove them
      const accountsHandler = (accounts: string[]) => {
        console.log('Accounts changed:', accounts);
        setAccounts(accounts);
        onConnect(accounts.length > 0);
      };

      const chainHandler = (chainId: string) => {
        console.log('Chain changed:', chainId);
      };

      // Remove event listeners with proper references
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', accountsHandler);
        window.ethereum.removeListener('chainChanged', chainHandler);
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