import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NFT {
  id: string;
  name: string;
  description: string | null;
  price: number;
  video_url: string;
}

export const useNFTData = (connectedAccount?: string) => {
  const { data: nfts } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mock_nfts')
        .select('*');
      
      if (error) throw error;
      return data as NFT[];
    }
  });

  const { data: purchasedNfts } = useQuery({
    queryKey: ['purchased_nfts', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return [];
      const { data, error } = await supabase
        .from('mock_purchases')
        .select('nft_id')
        .eq('buyer_address', connectedAccount);
      
      if (error) throw error;
      return data.map(purchase => purchase.nft_id);
    },
    enabled: !!connectedAccount
  });

  return { nfts, purchasedNfts };
};