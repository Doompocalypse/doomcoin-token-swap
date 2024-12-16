import { SupportedChains } from "@/types/wallet";
import { supabase } from "@/integrations/supabase/client";

export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia Chain ID

export const getSupportedChains = async (): Promise<SupportedChains> => {
  const { data, error } = await supabase.rpc('get_secret', {
    secret_name: 'INFURA_PROJECT_ID'
  });

  if (error || !data) {
    console.error("Error fetching Infura Project ID:", error);
    throw new Error("Failed to fetch Infura Project ID");
  }

  const infuraProjectId = data as string;

  return {
    "0xaa36a7": {
      chainId: "0xaa36a7",
      chainName: "Sepolia",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [`https://sepolia.infura.io/v3/${infuraProjectId}`],
      blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    },
  };
};

export const switchToSepolia = async () => {
  if (!window.ethereum) return false;
  
  try {
    console.log("Attempting to switch to Sepolia network...");
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
    console.log("Successfully switched to Sepolia");
    return true;
  } catch (switchError: any) {
    console.log("Error switching to Sepolia:", switchError);
    if (switchError.code === 4902) {
      try {
        console.log("Adding Sepolia network to wallet...");
        const supportedChains = await getSupportedChains();
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [supportedChains[SEPOLIA_CHAIN_ID]],
        });
        console.log("Successfully added Sepolia network");
        return true;
      } catch (addError) {
        console.error('Error adding Sepolia chain:', addError);
        return false;
      }
    }
    console.error('Error switching to Sepolia chain:', switchError);
    return false;
  }
};