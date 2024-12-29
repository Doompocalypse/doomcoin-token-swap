import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NFT } from "@/types/nft";

export const useRealNFTData = (connectedAccount?: string) => {
  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['real_nfts'],
    queryFn: async () => {
      console.log('Fetching NFTs from Supabase');
      const { data: nftData, error: nftError } = await supabase
        .from('nft_metadata')
        .select('*')
        .order('token_id');
      
      if (nftError) {
        console.error('Error fetching NFTs:', nftError);
        throw nftError;
      }

      console.log('Received NFT data from Supabase:', nftData);
      
      const transformedData: NFT[] = nftData.map(nft => {
        // Determine price based on token_id
        let price = 10; // Default Survivor Tier price
        switch (nft.token_id) {
          case "1": price = 10; break;        // Survivor Tier
          case "2": price = 100; break;       // Strategist Tier
          case "3": price = 1000; break;      // Vanguard Tier
          case "4": price = 10000; break;     // Commander Tier
          case "5": price = 100000; break;    // Architect Tier
          case "6": price = 1000000; break;   // Visionary Tier
          default: price = 10;
        }

        return {
          id: nft.token_id,
          name: nft.name,
          description: nft.description || '',
          price: price,
          imageUrl: nft.image_url,
          videoUrl: '', // We don't store videos in metadata currently
        };
      });

      console.log('Transformed NFT data:', transformedData);
      return transformedData;
    }
  });

  const { data: purchasedNfts } = useQuery({
    queryKey: ['nft_purchases', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return [];
      
      console.log('Fetching purchased NFTs for account:', connectedAccount);
      const { data, error } = await supabase
        .from('nft_purchases')
        .select('token_id')
        .eq('buyer_address', connectedAccount);
      
      if (error) {
        console.error('Error fetching purchased NFTs:', error);
        throw error;
      }
      
      console.log('Received purchased NFTs:', data);
      return data.map(purchase => purchase.token_id);
    },
    enabled: !!connectedAccount
  });

  return { nfts, purchasedNfts, nftsError };
};