import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NFT } from "@/types/nft";

export const useNFTData = (connectedAccount?: string) => {
  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      console.log('Fetching NFTs from Supabase');
      const { data, error } = await supabase
        .from('nft_metadata')
        .select('*')
        .order('token_id', { ascending: true });
      
      if (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
      
      // Transform the data to match the NFT interface
      const transformedData: NFT[] = data.map(nft => ({
        id: nft.token_id,
        name: nft.name,
        description: nft.description,
        price: 1000, // Default price in DMC tokens
        videoUrl: '', // We don't store videos in metadata currently
        imageUrl: nft.image_url,
      }));
      
      console.log('Received NFTs from Supabase:', transformedData);
      return transformedData;
    }
  });

  const { data: purchasedNfts, error: purchasedError } = useQuery({
    queryKey: ['purchased_nfts', connectedAccount],
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

  if (nftsError) console.error('NFTs query error:', nftsError);
  if (purchasedError) console.error('Purchased NFTs query error:', purchasedError);

  return { nfts, purchasedNfts };
};