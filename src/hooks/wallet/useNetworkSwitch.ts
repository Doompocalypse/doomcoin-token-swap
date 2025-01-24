import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import { useToast } from "@/hooks/use-toast";

export const useNetworkSwitch = () => {
  const { toast } = useToast();

  const switchToSupportedNetwork = async (provider: any) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_CHAIN_ID }],
      });
      console.log("Switched to Arbitrum One network");
    } catch (error: any) {
      console.error("Error switching network:", error);
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Arbitrum One network. Please try manually.",
        variant: "destructive",
      });
      throw new Error("Failed to switch network");
    }
  };

  return {
    switchToSupportedNetwork,
  };
};