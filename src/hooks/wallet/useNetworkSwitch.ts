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

      console.log("Attempting to fetch Infura Project ID...");

      if (secretError) {
        console.error("Error fetching Infura Project ID:", secretError);
        toast({
          title: "Network Configuration Error",
          description: "Could not fetch network configuration. Please try again or contact support.",
          variant: "destructive"
        });
        throw new Error(`Failed to fetch network configuration: ${secretError.message}`);
      }

      if (!infuraProjectId) {
        console.error("No Infura Project ID found in database");
        toast({
          title: "Missing Configuration",
          description: "Infura Project ID is not set. Please configure it in the project settings.",
          variant: "destructive"
        });
        throw new Error("Infura Project ID is not set in the database");
      }

      if (infuraProjectId.trim() === '') {
        console.error("Infura Project ID is empty");
        toast({
          title: "Invalid Configuration",
          description: "Infura Project ID cannot be empty. Please check your configuration.",
          variant: "destructive"
        });
        throw new Error("Infura Project ID is empty");
      }

      console.log("Successfully retrieved Infura configuration");
      
      if (currentChainId.toLowerCase() !== SEPOLIA_CHAIN_ID.toLowerCase()) {
        try {
          console.log("Attempting to switch to Sepolia...");
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
          console.log("Successfully switched to Sepolia");
          
          toast({
            title: "Network Changed",
            description: "Successfully connected to Sepolia network",
          });
        } catch (switchError: any) {
          console.error("Network switch error:", switchError);
          
          if (switchError.code === 4902) {
            console.log("Sepolia network not found, attempting to add it...");
            
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
            toast({
              title: "Network Added",
              description: "Sepolia network has been added to your wallet",
            });
          } else {
            toast({
              title: "Network Switch Failed",
              description: "Failed to switch to Sepolia network. Please try again.",
              variant: "destructive"
            });
            throw switchError;
          }
        }
      } else {
        console.log("Already on Sepolia network");
      }
    } catch (error: any) {
      console.error("Error in switchToSepolia:", error);
      throw error;
    }
  };

  return { switchToSepolia };
};