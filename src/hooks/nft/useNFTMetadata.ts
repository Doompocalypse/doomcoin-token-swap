import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NFT } from "@/types/nft";

interface NFTAttributes {
  price: number;
  [key: string]: any;
}

export const useNFTMetadata = () => {
  return useQuery({
    queryKey: ['nft_metadata'],
    queryFn: async () => {
      console.log('Fetching NFT metadata from Supabase');
      const { data: metadataRows, error: metadataError } = await supabase
        .from('nft_metadata')
        .select('*')
        .order('token_id');
      
      if (metadataError) {
        console.error('Error fetching NFT metadata:', metadataError);
        throw metadataError;
      }

      console.log('Successfully fetched metadata rows:', metadataRows);
      
      return metadataRows.map(metadata => {
        let attributes: NFTAttributes | null = null;
        try {
          attributes = metadata.attributes as NFTAttributes;
        } catch (error) {
          console.error('Error parsing attributes for token', metadata.token_id, ':', error);
        }
        
        const price = attributes?.price || 1000; // Default price if not set
        
        return {
          id: metadata.token_id,
          name: metadata.name,
          description: metadata.description || '',
          price,
          imageUrl: metadata.image_url,
          videoUrl: '', // We don't store videos in metadata currently
        };
      });
    }
  });
};