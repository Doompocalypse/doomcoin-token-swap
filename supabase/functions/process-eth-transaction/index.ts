import { ethers } from 'https://esm.sh/ethers@6.11.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// DMC Token Contract ABI (minimal required for transfer)
const DMC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { buyerAddress, ethAmount } = await req.json();
    console.log(`Processing transaction for buyer: ${buyerAddress}, ETH amount: ${ethAmount}`);

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/demo");
    const botPrivateKey = Deno.env.get("BOT_WALLET_PRIVATE_KEY");
    
    if (!botPrivateKey) {
      throw new Error("Bot wallet private key not configured");
    }

    const botWallet = new ethers.Wallet(botPrivateKey, provider);
    console.log("Bot wallet initialized:", botWallet.address);

    // DMC Token Contract
    const dmcTokenAddress = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    const dmcContract = new ethers.Contract(dmcTokenAddress, DMC_ABI, botWallet);

    // Calculate DMC amount (1:1 ratio with ETH)
    const dmcAmount = ethers.parseEther(ethAmount);
    console.log(`Attempting to send ${ethAmount} DMC tokens to ${buyerAddress}`);

    // Check bot's DMC balance
    const botBalance = await dmcContract.balanceOf(botWallet.address);
    console.log(`Bot DMC balance: ${ethers.formatEther(botBalance)} DMC`);

    if (botBalance < dmcAmount) {
      throw new Error("Insufficient DMC balance in bot wallet");
    }

    // Send DMC tokens
    const tx = await dmcContract.transfer(buyerAddress, dmcAmount);
    console.log("Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

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