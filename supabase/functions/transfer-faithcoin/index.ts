import { ethers } from 'https://esm.sh/ethers@6.11.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Faithcoin Token Contract ABI (minimal required for transfer)
const FAITHCOIN_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { toAddress, amount } = await req.json();
    console.log(`Processing Faithcoin transfer to: ${toAddress}`);

    const alchemyApiKey = Deno.env.get("ALCHEMY_API_KEY");
    if (!alchemyApiKey) {
      throw new Error("Alchemy API key not configured");
    }

    const provider = new ethers.JsonRpcProvider(`https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`);
    const botPrivateKey = Deno.env.get("BOT_WALLET_PRIVATE_KEY");
    
    if (!botPrivateKey) {
      throw new Error("Bot wallet private key not configured");
    }

    const botWallet = new ethers.Wallet(botPrivateKey, provider);
    console.log("Bot wallet initialized:", botWallet.address);

    const faithcoinAddress = "0xaAcfFDe6fdb5B4eAF0aa3a66e15BcF8064839Fc4";
    const faithcoinContract = new ethers.Contract(faithcoinAddress, FAITHCOIN_ABI, botWallet);

    const faithcoinAmount = ethers.parseEther(amount);
    console.log(`Attempting to send ${amount} Faithcoin to ${toAddress}`);

    const tx = await faithcoinContract.transfer(toAddress, faithcoinAmount);
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
    console.error('Error processing Faithcoin transfer:', error);
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