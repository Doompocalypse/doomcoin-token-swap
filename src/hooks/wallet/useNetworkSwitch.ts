import { SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

export const useNetworkSwitch = () => {
  const switchToSepolia = async (provider: any) => {
    const currentChainId = await provider.request({
      method: 'eth_chainId'
    });
    
    console.log("Current chain ID:", currentChainId);
    console.log("Target Sepolia chain ID:", SEPOLIA_CHAIN_ID);

    // Get the Infura Project ID from Supabase
    const { data, error } = await supabase.rpc<string>('get_secret', {
      secret_name: 'INFURA_PROJECT_ID'
    });

    if (error || !data) {
      console.error("Error fetching Infura Project ID:", error);
      throw new Error("Failed to fetch Infura Project ID");
    }

    const infuraProjectId = data;
    
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
          throw switchError;
        }
      }
    }
  };

  return { switchToSepolia };
};