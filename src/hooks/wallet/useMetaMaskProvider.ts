import { useToast } from "@/hooks/use-toast";

export const useMetaMaskProvider = () => {
  const { toast } = useToast();

  const getMetaMaskProvider = () => {
    if (typeof window === "undefined") return null;
    
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return null;
    }
    
    return window.ethereum;
  };

  const validateProvider = (provider: any) => {
    if (!provider) {
      console.error("No Web3 provider available");
      return false;
    }
    return true;
  };

  return {
    getMetaMaskProvider,
    validateProvider,
  };
};