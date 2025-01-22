import { supabase } from "@/integrations/supabase/client";

export const purchaseNFT = async (
  tokenId: string,
  buyerAddress: string,
  pricePaid: number,
  transactionHash: string
) => {
  console.log("Recording NFT purchase:", {
    tokenId,
    buyerAddress,
    pricePaid,
    transactionHash,
  });

  const { data, error } = await supabase
    .from("nft_purchases")
    .insert({
      token_id: tokenId,
      buyer_address: buyerAddress,
      price_paid: pricePaid,
      transaction_hash: transactionHash,
    });

  if (error) {
    console.error("Error recording NFT purchase:", error);
    throw error;
  }

  return data;
};