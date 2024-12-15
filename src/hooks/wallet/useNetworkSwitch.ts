import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";
import { useToast } from "@/hooks/use-toast";

export const useNetworkSwitch = () => {
  const { toast } = useToast();
  
  const ensureArbitrumNetwork = async () => {
    if (!window.ethereum) {
      console.log("No Web3 wallet detected");
      return;
    }

    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log("Current network:", currentChainId);

      if (currentChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase()) {
        console.log("Current network:", currentChainId, "Switching to Arbitrum network...");
        
        try {
          // Try to switch to Arbitrum
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ARBITRUM_CHAIN_ID }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            toast({
              title: "Network Not Found",
              description: "Please add Arbitrum network to your wallet",
              variant: "destructive",
            });
          }
          throw new Error("Please switch to Arbitrum network manually");
        }
      }
    } catch (error: any) {
      console.error("Failed to switch network:", error);
      toast({
        title: "Network Switch Required",
        description: "Please switch to Arbitrum network to continue",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    ensureArbitrumNetwork,
  };
};