import { supabase } from "@/integrations/supabase/client";

export const purchaseNFT = async (tokenId: string, buyerAddress: string, price: number, transactionHash: string) => {
  console.log("Recording NFT purchase:", { tokenId, buyerAddress, price, transactionHash });
  
  try {
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('nft_purchases')
      .insert({
        token_id: tokenId,
        buyer_address: buyerAddress,
        price_paid: price,
        transaction_hash: transactionHash
      })
      .select()
      .single();

    if (purchaseError) {
      console.error("Error recording purchase:", purchaseError);
      throw purchaseError;
    }

    console.log("Purchase recorded successfully:", purchaseData);
    return purchaseData;
  } catch (error) {
    console.error("Purchase recording error:", error);
    throw error;
  }
};