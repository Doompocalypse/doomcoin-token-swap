import { useToast } from "@/components/ui/use-toast";
import { SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";
import { ethers } from "ethers";

export const useNetworkValidation = () => {
  const { toast } = useToast();

  const validateNetwork = async (provider: ethers.providers.Web3Provider) => {
    const network = await provider.getNetwork();
    console.log("Connected to network:", {
      name: network.name,
      chainId: network.chainId
    });
    
    const isValidNetwork = network.chainId === parseInt(SEPOLIA_CHAIN_ID, 16);
    
    if (!isValidNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia network for testing",
        variant: "destructive",
      });
    }

    return isValidNetwork;
  };

  return { validateNetwork };
};