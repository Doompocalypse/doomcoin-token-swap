import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NFT {
  id: string;
  name: string;
  description: string | null;
  price: number;
  video_url: string;
  image_url: string;
}

export const useNFTData = (connectedAccount?: string) => {
  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      console.log('Fetching NFTs from Supabase');
      const { data, error } = await supabase
        .from('mock_nfts')
        .select('*');
      
      if (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
      console.log('Received NFTs from Supabase:', data);
      return data as NFT[];
    }
  });

  const { data: purchasedNfts, error: purchasedError } = useQuery({
    queryKey: ['purchased_nfts', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return [];
      console.log('Fetching purchased NFTs for account:', connectedAccount);
      const { data, error } = await supabase
        .from('mock_purchases')
        .select('nft_id')
        .eq('buyer_address', connectedAccount);
      
      if (error) {
        console.error('Error fetching purchased NFTs:', error);
        throw error;
      }
      console.log('Received purchased NFTs:', data);
      return data.map(purchase => purchase.nft_id);
    },
    enabled: !!connectedAccount
  });

  if (nftsError) console.error('NFTs query error:', nftsError);
  if (purchasedError) console.error('Purchased NFTs query error:', purchasedError);

  return { nfts, purchasedNfts };
};