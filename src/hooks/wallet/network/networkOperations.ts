import { toast } from "@/components/ui/use-toast";
import { SEPOLIA_CHAIN_ID, getInfuraConfig } from "./networkConfig";

export const addSepoliaNetwork = async (provider: any, infuraProjectId: string) => {
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
  toast({
    title: "Network Added",
    description: "Sepolia network has been added to your wallet",
  });
};

export const switchToSepoliaNetwork = async (provider: any) => {
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
};