import { useNetwork, useSwitchNetwork } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { useToast } from "@/hooks/use-toast";

export const useNetworkSwitch = () => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { toast } = useToast();

  const ensureArbitrumNetwork = async () => {
    if (chain?.id !== arbitrum.id) {
      console.log("Switching to Arbitrum network...");
      try {
        await switchNetwork?.(arbitrum.id);
      } catch (error) {
        console.error("Failed to switch network:", error);
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to Arbitrum network in your wallet.",
          variant: "destructive",
        });
        throw error; // Re-throw to handle in calling code
      }
    }
  };

  return {
    ensureArbitrumNetwork,
    currentChain: chain,
  };
};