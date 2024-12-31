import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNFTPurchaseHistory = (connectedAccount?: string) => {
  return useQuery({
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
};