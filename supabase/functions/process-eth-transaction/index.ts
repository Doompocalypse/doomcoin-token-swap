import { ethers } from 'https://esm.sh/ethers@6.11.1';
import { corsHeaders } from './corsHeaders.ts';
import { retryWithBackoff } from './retryUtils.ts';
import { checkGasFees } from './gasUtils.ts';

// DMC Token Contract ABI (minimal required for transfer)
const DMC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { buyerAddress, dmcAmount } = await req.json();
    console.log(`Processing DMC transfer for buyer: ${buyerAddress}`);
    console.log(`DMC amount to transfer: ${dmcAmount}`);

    const alchemyApiKey = Deno.env.get("ALCHEMY_API_KEY");
    if (!alchemyApiKey) {
      throw new Error("Alchemy API key not configured");
    }

    const provider = new ethers.JsonRpcProvider(`https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`);
    const botPrivateKey = Deno.env.get("BOT_WALLET_PRIVATE_KEY");
    
    if (!botPrivateKey) {
      throw new Error("Bot wallet private key not configured");
    }

    const botWallet = await retryWithBackoff(async () => {
      const wallet = new ethers.Wallet(botPrivateKey, provider);
      await provider.getBalance(wallet.address);
      return wallet;
    });

    console.log("Bot wallet initialized:", botWallet.address);

    const dmcTokenAddress = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    const dmcContract = new ethers.Contract(dmcTokenAddress, DMC_ABI, botWallet);
    const dmcTokenAmount = ethers.parseEther(dmcAmount);

    console.log(`Attempting to transfer ${dmcAmount} DMC tokens to ${buyerAddress}`);

    const botDMCBalance = await retryWithBackoff(() => dmcContract.balanceOf(botWallet.address));
    console.log(`Bot DMC balance: ${ethers.formatEther(botDMCBalance)} DMC`);

    if (botDMCBalance < dmcTokenAmount) {
      throw new Error("Insufficient DMC balance in bot wallet");
    }

    const { gasEstimate, maxFeePerGas, maxPriorityFeePerGas } = await checkGasFees(
      provider, 
      botWallet, 
      dmcContract, 
      buyerAddress, 
      dmcTokenAmount
    );

    const tx = await retryWithBackoff(() => 
      dmcContract.transfer(buyerAddress, dmcTokenAmount, {
        gasLimit: gasEstimate,
        maxFeePerGas,
        maxPriorityFeePerGas,
      })
    );
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await retryWithBackoff(() => tx.wait());
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    return new Response(
      JSON.stringify({
        success: true,
        transactionHash: receipt.hash,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing transaction:', error);
    
    let errorMessage = error.message;
    if (errorMessage.includes('insufficient funds for gas')) {
      errorMessage = 'The system is temporarily unable to process transactions due to insufficient gas funds. Please try again later.';
    } else if (errorMessage.includes('nonce')) {
      errorMessage = 'Transaction ordering issue. Please try again.';
    } else if (errorMessage.includes('replacement fee too low')) {
      errorMessage = 'Network is congested. Please try again later.';
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});