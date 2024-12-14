import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { ethers } from 'https://esm.sh/ethers@6.11.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransactionRequest {
  buyerAddress: string;
  ethAmount: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { buyerAddress, ethAmount } = await req.json() as TransactionRequest;
    console.log(`Processing transaction for buyer: ${buyerAddress}, ETH amount: ${ethAmount}`);

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/demo");
    const botWallet = new ethers.Wallet(
      Deno.env.get("BOT_WALLET_PRIVATE_KEY") || "",
      provider
    );

    // DMC Token Contract (replace with actual DMC token contract address)
    const dmcTokenAddress = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    const dmcTokenABI = [
      "function transfer(address to, uint256 amount) returns (bool)",
      "function balanceOf(address account) view returns (uint256)",
    ];
    const dmcContract = new ethers.Contract(dmcTokenAddress, dmcTokenABI, botWallet);

    // Calculate DMC amount (1:1 ratio with ETH)
    const ethValue = ethers.parseEther(ethAmount);
    const dmcAmount = ethValue; // 1:1 ratio

    console.log(`Attempting to send ${ethAmount} DMC tokens to ${buyerAddress}`);

    // Send DMC tokens
    const tx = await dmcContract.transfer(buyerAddress, dmcAmount);
    const receipt = await tx.wait();

    console.log(`Transaction successful! Hash: ${receipt.hash}`);

    return new Response(
      JSON.stringify({
        success: true,
        transactionHash: receipt.hash,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing transaction:', error);
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