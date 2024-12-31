import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";
import { NFT } from "@/types/nft";

const NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function exists(uint256 id) view returns (bool)"
];

export const useRealNFTData = (connectedAccount?: string) => {
  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['real_nfts', connectedAccount],
    queryFn: async () => {
      console.log('Fetching NFT metadata from Supabase');
      try {
        const { data: metadataRows, error: metadataError } = await supabase
          .from('nft_metadata')
          .select('*')
          .order('token_id');
        
        if (metadataError) {
          console.error('Error fetching NFT metadata:', metadataError);
          throw metadataError;
        }

        console.log('Successfully fetched metadata rows:', metadataRows);

        // Get contract address and Infura Project ID
        const { data: settings, error: settingsError } = await supabase
          .from('app_settings')
          .select('key,value')
          .in('key', ['nft_contract_address', 'INFURA_PROJECT_ID']);
        
        if (settingsError) {
          console.error('Error fetching settings:', settingsError);
          throw settingsError;
        }

        const contractAddress = settings?.find(s => s.key === 'nft_contract_address')?.value;
        const infuraProjectId = settings?.find(s => s.key === 'INFURA_PROJECT_ID')?.value;

        if (!contractAddress || !infuraProjectId) {
          console.error('Missing required settings');
          throw new Error('Missing required settings');
        }

        console.log('Successfully fetched contract address:', contractAddress);

        // Use Infura Sepolia endpoint with API key
        const provider = new ethers.JsonRpcProvider(
          `https://sepolia.infura.io/v3/${infuraProjectId}`
        );
        
        const contract = new ethers.Contract(contractAddress, NFT_ABI, provider);
        
        const nftData: NFT[] = [];
        
        for (const metadata of metadataRows) {
          try {
            // Get token balance if connected
            let balance = 0;
            if (connectedAccount) {
              try {
                balance = Number(await contract.balanceOf(connectedAccount, metadata.token_id));
                console.log(`Balance for token ${metadata.token_id}:`, balance);
              } catch (error) {
                console.warn(`Error getting balance for token ${metadata.token_id}:`, error);
                // Continue with balance 0 if there's an error
              }
            }

            // Parse attributes and get price
            const attributes = metadata.attributes as { price?: number } | null;
            const price = attributes?.price || 1000; // Default price if not set
            
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
          }
        }
        
        console.log('Successfully processed NFT data:', nftData);
        return nftData;
      } catch (error) {
        console.error('Error in useRealNFTData:', error);
        throw error;
      }
    },
    enabled: true // Always fetch NFT data, even if not connected
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