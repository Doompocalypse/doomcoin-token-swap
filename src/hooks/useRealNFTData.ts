import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";
import { NFT, NFTMetadata } from "@/types/nft";

const NFT_ABI = [
  "function uri(uint256 id) view returns (string)",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function totalSupply(uint256 id) view returns (uint256)",
  "function exists(uint256 id) view returns (bool)"
];

export const useRealNFTData = (connectedAccount?: string) => {
  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['real_nfts', connectedAccount],
    queryFn: async () => {
      // Fetch NFTs from metadata table
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

          const price = metadata.attributes?.price || 1000;
          
          nftData.push({
            id: metadata.token_id,
            name: metadata.name,
            description: metadata.description,
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