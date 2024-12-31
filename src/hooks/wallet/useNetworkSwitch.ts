import { ARBITRUM_CHAIN_ID, SEPOLIA_CHAIN_ID, SUPPORTED_CHAINS } from "@/utils/chainConfig";
import { useToast } from "@/hooks/use-toast";

export const useNetworkSwitch = () => {
  const { toast } = useToast();

  const switchToSupportedNetwork = async (provider: any) => {
    const currentChainId = await provider.request({
      method: 'eth_chainId'
    });
    
    console.log("Current chain ID:", currentChainId);
    
    // If already on a supported network, no need to switch
    if ([ARBITRUM_CHAIN_ID.toLowerCase(), SEPOLIA_CHAIN_ID.toLowerCase()].includes(currentChainId.toLowerCase())) {
      console.log("Already on a supported network");
      return;
    }

    // Try Arbitrum first, then Sepolia if that fails
    try {
      console.log("Attempting to switch to Arbitrum...");
      await switchToNetwork(provider, ARBITRUM_CHAIN_ID);
    } catch (arbitrumError) {
      console.log("Failed to switch to Arbitrum, trying Sepolia...", arbitrumError);
      try {
        await switchToNetwork(provider, SEPOLIA_CHAIN_ID);
      } catch (sepoliaError) {
        console.error("Failed to switch to any supported network:", sepoliaError);
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to either Arbitrum One or Sepolia network in your wallet.",
          variant: "destructive",
        });
        throw sepoliaError;
      }
    }
  };

  const switchToNetwork = async (provider: any, chainId: string) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      console.log(`Successfully switched to chain ID: ${chainId}`);
    } catch (switchError: any) {
      console.log("Network switch error:", switchError);
      if (switchError.code === 4902) {
        console.log("Network not found, attempting to add...");
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [SUPPORTED_CHAINS[chainId]],
        });
      } else {
        throw switchError;
      }
    }
  };

  return { switchToSupportedNetwork };
};