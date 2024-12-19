import { supabase } from "@/integrations/supabase/client";

export const recordMintInSupabase = async (
  tokenId: string,
  walletAddress: string,
  contractAddress: string
) => {
  const uuid = crypto.randomUUID();
  console.log("Generated UUID for storage:", uuid);

  const { error: dbError } = await supabase
    .from('mock_purchases')
    .insert([{ 
      id: uuid,
      nft_id: uuid,
      buyer_address: walletAddress,
      contract_address: contractAddress
    }]);

  if (dbError) {
    console.error('Error recording mint:', dbError);
    throw dbError;
  }
};