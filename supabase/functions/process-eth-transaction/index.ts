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

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function retryWithBackoff(operation: () => Promise<any>, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY) {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    
    console.log(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { buyerAddress, dmcAmount } = await req.json();
    console.log(`Processing DMC transfer for buyer: ${buyerAddress}`);
    console.log(`DMC amount to transfer: ${dmcAmount}`);

    // Get Alchemy API key from environment
    const alchemyApiKey = Deno.env.get("ALCHEMY_API_KEY");
    if (!alchemyApiKey) {
      throw new Error("Alchemy API key not configured");
    }

    // Initialize provider with Arbitrum One RPC URL
    const provider = new ethers.JsonRpcProvider(`https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`);
    const botPrivateKey = Deno.env.get("BOT_WALLET_PRIVATE_KEY");
    
    if (!botPrivateKey) {
      throw new Error("Bot wallet private key not configured");
    }

    // Initialize wallet with retries
    const botWallet = await retryWithBackoff(async () => {
      const wallet = new ethers.Wallet(botPrivateKey, provider);
      await provider.getBalance(wallet.address);
      return wallet;
    });

    console.log("Bot wallet initialized:", botWallet.address);

    // DMC Token Contract
    const dmcTokenAddress = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    const dmcContract = new ethers.Contract(dmcTokenAddress, DMC_ABI, botWallet);

    // Convert DMC amount to token amount with 18 decimals
    const dmcTokenAmount = ethers.parseEther(dmcAmount);
    console.log(`Attempting to transfer ${dmcAmount} DMC tokens from ${buyerAddress}`);

    // Check bot's DMC balance with retries
    const botBalance = await retryWithBackoff(() => dmcContract.balanceOf(botWallet.address));
    console.log(`Bot DMC balance: ${ethers.formatEther(botBalance)} DMC`);

    if (botBalance < dmcTokenAmount) {
      throw new Error("Insufficient DMC balance in bot wallet");
    }

    // Transfer DMC tokens from user to bot wallet
    const tx = await retryWithBackoff(() => dmcContract.transfer(buyerAddress, dmcTokenAmount));
    console.log("Transaction sent:", tx.hash);
    
    const receipt = await retryWithBackoff(() => tx.wait());
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