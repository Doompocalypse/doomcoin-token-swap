import { toast } from "@/components/ui/use-toast";

export const setupWalletEventHandlers = (
  onAccountsChanged: (accounts: string[]) => void,
  cleanup = false
) => {
  const handleAccountsChanged = (newAccounts: string[]) => {
    console.log("Accounts changed:", newAccounts);
    onAccountsChanged(newAccounts);
  };

  const handleChainChanged = async (chainId: string) => {
    console.log("Network changed to:", chainId);
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error handling chain change:", error);
      toast({
        title: "Network Change Error",
        description: "There was an error handling the network change. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  if (window.ethereum) {
    if (cleanup) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      console.log("Cleanup: Removed network and account listeners");
      return;
    }

    // Remove any existing listeners before adding new ones
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
    
    // Add new listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    
    console.log("Network and account change listeners initialized");
  }
};