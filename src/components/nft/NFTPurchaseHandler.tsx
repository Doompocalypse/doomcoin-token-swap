import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getDMCBalance } from "@/utils/web3Transactions";

export const useNFTPurchaseHandler = (
  connectedAccount?: string,
  onInsufficientBalance?: () => void
) => {
  const { toast } = useToast();

  const handlePurchase = async (nftId: string, price: number) => {
    if (!connectedAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase NFTs",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check DMC balance
      const balance = await getDMCBalance(connectedAccount);
      console.log("User DMC balance:", balance, "Required:", price);
      
      if (balance < price) {
        console.log("Insufficient DMC balance");
        onInsufficientBalance?.();
        return;
      }

      const { error } = await supabase
        .from('mock_purchases')
        .insert({
          nft_id: nftId,
          buyer_address: connectedAccount,
          contract_address: "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073"
        });

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