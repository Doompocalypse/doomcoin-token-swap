import { supabase } from "@/integrations/supabase/client";

export const useNFTStorage = () => {
  const recordMintInSupabase = async (
    tokenId: string,
    connectedAccount: string,
    contractAddress: string
  ) => {
    console.log("Recording mint in Supabase:", {
      tokenId,
      connectedAccount,
      contractAddress,
    });

    const { error: dbError } = await supabase
      .from('mock_purchases')
      .insert([{ 
        nft_id: tokenId,
        buyer_address: connectedAccount,
        contract_address: contractAddress
      }]);

    if (dbError) {
      console.error('Error recording mint:', dbError);
      // Don't throw here as the NFT was successfully minted
    }
  };

  return { recordMintInSupabase };
};