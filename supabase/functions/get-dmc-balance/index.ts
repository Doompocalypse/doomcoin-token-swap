import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()
    console.log('Checking DMC balance for address:', address)

    // For demo purposes, return a mock balance based on the address
    // In production, this would query the actual blockchain
    const mockBalance = parseInt(address.slice(-4), 16) % 10000
    console.log('Returning mock balance:', mockBalance)

    return new Response(
      JSON.stringify({
        success: true,
        balance: mockBalance,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error getting DMC balance:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})