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

  return { disconnectWallet };
};