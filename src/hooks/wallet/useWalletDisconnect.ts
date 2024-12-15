import { useToast } from "@/hooks/use-toast";
import { useDisconnect } from 'wagmi';

export const useWalletDisconnect = (
  setAccounts: (accounts: string[]) => void,
  onConnect: (connected: boolean) => void
) => {
  const { toast } = useToast();
  const { disconnect: disconnectWagmi } = useDisconnect();

  const disconnectWallet = async () => {
    try {
      console.log("Starting wallet disconnection process...");
      
      // Clear local state first
      setAccounts([]);
      onConnect(false);
      
      // Disconnect WalletConnect if active
      if (window.ethereum?.isWalletConnect) {
        console.log("Disconnecting WalletConnect...");
        disconnectWagmi();
      }
      
      // For MetaMask, request new permissions to force disconnect
      if (window.ethereum?.isMetaMask) {
        try {
          console.log("Resetting MetaMask permissions...");
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });
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
      localStorage.setItem('wallet_disconnected', 'true');
      
      // Clear local state immediately
      setAccounts([]);
      onConnect(false);
      
      // Disconnect WalletConnect if active
      if (window.ethereum?.isWalletConnect) {
        console.log("Force disconnecting WalletConnect...");
        disconnectWagmi();
      }
      
      // Remove all event listeners
      if (window.ethereum) {
        const events = ['accountsChanged', 'chainChanged', 'connect', 'disconnect'];
        events.forEach(event => {
          window.ethereum?.removeListener(event, () => {});
        });
        console.log("Removed all network event listeners");
      }

      // Clear any cached provider data
      if (window.localStorage) {
        const walletKeys = Object.keys(window.localStorage).filter(key => 
          key.toLowerCase().includes('wallet') || 
          key.toLowerCase().includes('web3') || 
          key.toLowerCase().includes('metamask') ||
          key.toLowerCase().includes('wc@')
        );
        
        walletKeys.forEach(key => {
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

  return {
    disconnectWallet,
    forceDisconnectWallet,
  };
};