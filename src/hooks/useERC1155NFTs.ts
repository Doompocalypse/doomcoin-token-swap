import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NFT {
  id: string;
  name: string;
  description: string | null;
  price: number;
  videoUrl: string;
  imageUrl: string;
  balance: number;
}

export const useERC1155NFTs = (connectedAccount?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['nfts', connectedAccount],
    queryFn: async () => {
      console.log('Fetching NFTs from Supabase');
      
      // Fetch NFTs
      const { data: nfts, error: nftsError } = await supabase
        .from('mock_nfts')
        .select('*')
        .order('price', { ascending: true });

      if (nftsError) {
        console.error('Error fetching NFTs:', nftsError);
        throw nftsError;
      }

      // If we have a connected account, fetch their purchases
      let purchases: any[] = [];
      if (connectedAccount) {
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('mock_purchases')
          .select('nft_id')
          .eq('buyer_address', connectedAccount);

        if (purchaseError) {
          console.error('Error fetching purchases:', purchaseError);
          throw purchaseError;
        }
        purchases = purchaseData || [];
      }

      // Map NFTs to the expected format
      const formattedNfts: NFT[] = nfts.map(nft => {
        const balance = purchases.filter(p => p.nft_id === nft.id).length;
        return {
          id: nft.id,
          name: nft.name,
          description: nft.description,
          price: nft.price,
          videoUrl: nft.video_url,
          imageUrl: nft.image_url,
          balance
        };
      });

      console.log('Formatted NFTs:', formattedNfts);
      return formattedNfts;
    },
    enabled: true // Always fetch NFTs, even without connected account
  });

  return {
    data,
    isLoading,
    error
  };
};