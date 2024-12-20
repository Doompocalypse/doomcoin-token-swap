import { useToast } from "@/hooks/use-toast";

export const useMetaMaskProvider = () => {
  const { toast } = useToast();

  const getMetaMaskProvider = () => {
    console.log("Detecting MetaMask provider...");
    
    // Check for multiple providers
    if (window.ethereum?.providers?.length > 0) {
      console.log("Multiple providers detected:", window.ethereum.providers);
      // Explicitly find MetaMask provider
      const metaMaskProvider = window.ethereum.providers.find(
        (p: any) => p.isMetaMask && !p.isCoinbaseWallet
      );
      if (metaMaskProvider) {
        console.log("Found explicit MetaMask provider in providers array");
        return metaMaskProvider;
      }
    }
    
    // Check single provider case
    if (window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet) {
      console.log("Found MetaMask as single provider");
      return window.ethereum;
    }
    
    console.log("No valid MetaMask provider found");
    return null;
  };

  const validateProvider = (provider: any) => {
    if (!provider) {
      console.error("MetaMask provider not found");
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect. If you have other wallet extensions, please disable them temporarily.",
        variant: "destructive",
      });
      return false;
    }

    if (!provider.isMetaMask || provider.isCoinbaseWallet) {
      console.error("Invalid wallet detected");
      toast({
        title: "Invalid Wallet",
        description: "Please ensure you're using MetaMask.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    getMetaMaskProvider,
    validateProvider
  };
};