import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const tokenId = url.searchParams.get('tokenId');

    if (!tokenId) {
      return new Response(
        JSON.stringify({ error: 'Token ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Fetching metadata for token:', tokenId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: nft, error } = await supabase
      .from('mock_nfts')
      .select('*')
      .eq('id', tokenId)
      .single();

    if (error || !nft) {
      console.error('Error fetching NFT:', error);
      return new Response(
        JSON.stringify({ error: 'NFT not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Create metadata object following OpenSea metadata standards
    const metadata = {
      name: nft.name,
      description: nft.description,
      image: nft.video_url, // Using video URL as preview image
      animation_url: nft.video_url, // Actual video content
      attributes: [
        {
          trait_type: "Collection",
          value: "Cleopatra's Necklace"
        },
        {
          trait_type: "Price",
          value: nft.price
        }
      ]
    };

    console.log('Generated metadata:', metadata);

    return new Response(
      JSON.stringify(metadata),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});