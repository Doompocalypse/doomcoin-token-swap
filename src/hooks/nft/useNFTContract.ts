import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";

const NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function exists(uint256 id) view returns (bool)",
  "function uri(uint256 id) view returns (string)",
  "function totalSupply(uint256 id) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

export const useNFTContract = (connectedAccount?: string) => {
  return useQuery({
    queryKey: ['nft_contract', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return null;

      // Get NFT contract address from app_settings
      const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'nft_contract_address')
        .single();
      
      if (settingsError || !settings) {
        console.error('Error fetching NFT contract address:', settingsError);
        throw new Error('NFT contract address not found');
      }

      const contractAddress = settings.value;
      console.log('NFT Contract Address:', contractAddress);

      // Initialize provider and contract
      const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
      const contract = new ethers.Contract(contractAddress, NFT_ABI, provider);
      
      return contract;
    },
    enabled: !!connectedAccount
  });
};