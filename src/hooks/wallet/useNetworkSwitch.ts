import { SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useNetworkSwitch = () => {
  const switchToSepolia = async (provider: any) => {
    try {
      const currentChainId = await provider.request({
        method: 'eth_chainId'
      });
      
      console.log("Current chain ID:", currentChainId);
      console.log("Target Sepolia chain ID:", SEPOLIA_CHAIN_ID);

      // Get the Infura Project ID from Supabase
      const { data: infuraProjectId, error: secretError } = await supabase.rpc('get_secret', {
        secret_name: 'INFURA_PROJECT_ID'
      });

      if (secretError) {
        console.error("Error fetching Infura Project ID:", secretError);
        throw new Error("Failed to fetch network configuration");
      }

      if (!infuraProjectId) {
        console.error("No Infura Project ID found");
        toast({
          title: "Configuration Error",
          description: "Infura Project ID is not set. Please set it in the project settings.",
          variant: "destructive"
        });
        throw new Error("Infura Project ID is not configured");
      }

      console.log("Retrieved Infura configuration");
      
      if (currentChainId.toLowerCase() !== SEPOLIA_CHAIN_ID.toLowerCase()) {
        try {
          console.log("Attempting to switch to Sepolia...");
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
          console.log("Successfully switched to Sepolia");
        } catch (switchError: any) {
          console.error("Network switch error:", switchError);
          if (switchError.code === 4902) {
            console.log("Adding Sepolia network...");
            
            // Ensure we have the Infura Project ID before adding the network
            if (!infuraProjectId) {
              throw new Error("Infura Project ID is required to add Sepolia network");
            }

            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: [`https://sepolia.infura.io/v3/${infuraProjectId}`],
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              }]
            });
            console.log("Sepolia network added successfully");
          } else {
            toast({
              title: "Network Switch Failed",
              description: "Failed to switch to Sepolia network. Please try again.",
              variant: "destructive"
            });
            throw switchError;
          }
        }
      }
    } catch (error: any) {
      console.error("Error in switchToSepolia:", error);
      throw error;
    }
  };

  return { switchToSepolia };
};