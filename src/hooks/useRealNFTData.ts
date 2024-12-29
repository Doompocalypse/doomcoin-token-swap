import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";
import { NFT } from "@/types/nft";

const NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function exists(uint256 id) view returns (bool)"
];

interface NFTAttributes {
  price: number;
  [key: string]: any;
}

export const useRealNFTData = (connectedAccount?: string) => {
  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['real_nfts', connectedAccount],
    queryFn: async () => {
      console.log('Fetching NFT metadata from Supabase');
      const { data: metadataRows, error: metadataError } = await supabase
        .from('nft_metadata')
        .select('*')
        .order('token_id');
      
      if (metadataError) {
        console.error('Error fetching NFT metadata:', metadataError);
        throw metadataError;
      }

      console.log('Fetched metadata rows:', metadataRows);

      const { data: contractAddress } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'nft_contract_address')
        .single();
      
      if (!contractAddress) {
        throw new Error('NFT contract address not found');
      }

      const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
      const contract = new ethers.Contract(contractAddress.value, NFT_ABI, provider);
      
      const nftData: NFT[] = [];
      
      for (const metadata of metadataRows) {
        try {
          // Get token balance if connected
          let balance = 0;
          if (connectedAccount) {
            try {
              balance = Number(await contract.balanceOf(connectedAccount, metadata.token_id));
            } catch (error) {
              console.log(`Error getting balance for token ${metadata.token_id}:`, error);
              // Continue with balance 0 if there's an error
            }
          }

          // Parse attributes and get price based on token_id
          let price = 10; // Default Survivor Tier price
          switch (metadata.token_id) {
            case "1": price = 10; break;        // Survivor Tier
            case "2": price = 100; break;       // Strategist Tier
            case "3": price = 1000; break;      // Vanguard Tier
            case "4": price = 10000; break;     // Commander Tier
            case "5": price = 100000; break;    // Architect Tier
            case "6": price = 1000000; break;   // Visionary Tier
            default: price = 10;
          }
          
          nftData.push({
            id: metadata.token_id,
            name: metadata.name,
            description: metadata.description || '',
            price: price,
            imageUrl: metadata.image_url,
            videoUrl: '', // We don't store videos in metadata currently
            balance
          });
        } catch (error) {
          console.error(`Error processing NFT ${metadata.token_id}:`, error);
          // Continue with next NFT instead of failing completely
          continue;
        }
      }
      
      console.log('Processed NFT data:', nftData);
      return nftData;
    }
  });

  const { data: purchasedNfts } = useQuery({
    queryKey: ['nft_purchases', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return [];
      
      const { data, error } = await supabase
        .from('nft_purchases')
        .select('token_id')
        .eq('buyer_address', connectedAccount);
      
      if (error) throw error;
      return data.map(purchase => purchase.token_id);
    },
    enabled: !!connectedAccount
  });

  return { nfts, purchasedNfts, nftsError };
};