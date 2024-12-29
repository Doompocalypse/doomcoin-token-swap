import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NFT } from "@/types/nft";

export const useRealNFTData = (connectedAccount?: string) => {
  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['nft_metadata'],
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
      
      const transformedData: NFT[] = nftData.map(nft => ({
        id: nft.token_id,
        name: nft.name,
        description: nft.description || '',
        price: getPriceForTier(nft.token_id),
        imageUrl: nft.image_url,
        videoUrl: '',
      }));

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

// Helper function to determine price based on NFT tier
const getPriceForTier = (tokenId: string): number => {
  switch (tokenId) {
    case "1": return 10;        // Survivor Tier
    case "2": return 100;       // Strategist Tier
    case "3": return 1000;      // Vanguard Tier
    case "4": return 10000;     // Commander Tier
    case "5": return 100000;    // Architect Tier
    case "6": return 1000000;   // Visionary Tier
    default: return 10;
  }
};