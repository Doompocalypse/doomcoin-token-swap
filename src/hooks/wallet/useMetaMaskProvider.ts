import { useToast } from "@/hooks/use-toast";

export const useMetaMaskProvider = () => {
  const { toast } = useToast();

  const getMetaMaskProvider = () => {
    if (typeof window === 'undefined') return null;
    return window.ethereum;
  };

  const validateProvider = (provider: any): boolean => {
    if (!provider) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to connect your wallet.",
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