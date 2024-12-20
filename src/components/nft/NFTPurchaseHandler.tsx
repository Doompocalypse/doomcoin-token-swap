import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useNFTPurchaseHandler = (connectedAccount?: string) => {
  const { toast } = useToast();

  const handlePurchase = async (nftId: string) => {
    if (!connectedAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase NFTs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('mock_purchases')
        .insert([
          { nft_id: nftId, buyer_address: connectedAccount }
        ]);

      if (error) throw error;

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased this NFT!",
      });
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  return handlePurchase;
};