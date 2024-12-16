import { SupportedChains } from "@/types/wallet";
import { supabase } from "@/integrations/supabase/client";

export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia Chain ID

export const getSupportedChains = async (): Promise<SupportedChains> => {
  const { data, error } = await supabase.rpc<string>('get_secret', {
    secret_name: 'INFURA_PROJECT_ID'
  });

  if (error || !data) {
    console.error("Error fetching Infura Project ID:", error);
    throw new Error("Failed to fetch Infura Project ID");
  }

  const infuraProjectId = data;

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