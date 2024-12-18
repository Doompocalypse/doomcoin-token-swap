import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useNFTPurchaseHandler = (connectedAccount?: string, contractAddress?: string) => {
  const { toast } = useToast();

  const handlePurchase = async (nftId: string) => {
    console.log("Starting NFT purchase process...");
    console.log("Connected account:", connectedAccount);
    console.log("Contract address:", contractAddress);
    console.log("NFT ID:", nftId);

    if (!connectedAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase NFTs",
        variant: "destructive",
      });
      return;
    }

    if (!contractAddress) {
      toast({
        title: "Contract Required",
        description: "No contract address found. Please deploy or connect to a contract first.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Inserting purchase record into Supabase...");
      const { data, error } = await supabase
        .from('mock_purchases')
        .insert([
          { 
            nft_id: nftId, 
            buyer_address: connectedAccount,
            contract_address: contractAddress
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log("Purchase record created:", data);

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