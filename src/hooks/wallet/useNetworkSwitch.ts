import { useNetwork, useSwitchNetwork } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { useToast } from "@/hooks/use-toast";

export const useNetworkSwitch = () => {
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork();
  const { toast } = useToast();

  const ensureArbitrumNetwork = async () => {
    if (chain?.id !== arbitrum.id) {
      console.log("Current network:", chain?.id, "Switching to Arbitrum network...");
      try {
        if (!switchNetwork) {
          throw new Error("Network switching not supported");
        }
        
        await switchNetwork(arbitrum.id);
        console.log("Successfully switched to Arbitrum network");
      } catch (error) {
        console.error("Failed to switch network:", error);
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to Arbitrum network in your wallet.",
          variant: "destructive",
        });
        throw error;
      }
    } else {
      console.log("Already on Arbitrum network");
    }
  };

  return {
    ensureArbitrumNetwork,
    currentChain: chain,
    isNetworkSwitching: isLoading,
  };
};