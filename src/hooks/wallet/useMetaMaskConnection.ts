import { useToast } from "@/hooks/use-toast";
import { useNetworkSwitch } from "./useNetworkSwitch";

export const useMetaMaskConnection = () => {
  const { toast } = useToast();
  const { ensureArbitrumNetwork } = useNetworkSwitch();

  const connectMetaMask = async () => {
    if (!window.ethereum?.isMetaMask) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect.",
        variant: "destructive",
      });
      throw new Error("MetaMask not found");
    }

    try {
      console.log("Requesting fresh MetaMask connection...");
      
      // First get accounts without forcing network switch
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("Accounts after selection:", accounts);
      
      if (accounts.length > 0) {
        // After successful connection, check network
        try {
          await ensureArbitrumNetwork();
        } catch (networkError) {
          console.warn("Network switch failed, but wallet is connected:", networkError);
          // Don't throw here - we'll let the user switch networks manually if needed
        }
        return accounts;
      }
      
      throw new Error("No accounts selected");
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to MetaMask",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    connectMetaMask,
  };
};