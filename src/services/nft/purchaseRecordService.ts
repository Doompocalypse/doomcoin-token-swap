import { supabase } from "@/integrations/supabase/client";

export const recordPurchase = async (
  tokenId: string,
  buyerAddress: string,
  transactionHash: string,
  price: number
) => {
  console.log("Recording NFT purchase:", { tokenId, buyerAddress, transactionHash, price });
  
  const { error: purchaseError } = await supabase
    .from('nft_purchases')
    .insert({
      token_id: tokenId,
      buyer_address: buyerAddress,
      transaction_hash: transactionHash,
      price_paid: price
    });

  if (purchaseError) {
    console.error("Purchase recording error:", purchaseError);
    throw purchaseError;
  }
  
  console.log("Purchase recorded successfully");
};