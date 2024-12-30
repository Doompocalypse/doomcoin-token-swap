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

async function estimateGasWithFallback(dmcContract: ethers.Contract, toAddress: string, amount: bigint) {
  try {
    // Try to estimate gas
    const gasEstimate = await dmcContract.transfer.estimateGas(toAddress, amount);
    console.log('Initial gas estimate:', gasEstimate.toString());
    
    // Add 20% buffer to the estimate
    return gasEstimate * BigInt(120) / BigInt(100);
  } catch (error) {
    console.warn('Failed to estimate gas, using fallback:', error);
    // Use a conservative fallback value
    return BigInt(100000);
  }
}

async function getFeeData(provider: ethers.Provider) {
  try {
    const feeData = await provider.getFeeData();
    console.log('Raw fee data:', {
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
      gasPrice: feeData.gasPrice?.toString(),
    });

    // If EIP-1559 fees are not available, fall back to legacy gas price
    if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
      if (!feeData.gasPrice) {
        throw new Error('Neither EIP-1559 fees nor legacy gas price available');
      }
      
      const gasPrice = feeData.gasPrice * BigInt(80) / BigInt(100); // 80% of current gas price
      console.log('Using legacy gas price:', gasPrice.toString());
      
      return {
        maxFeePerGas: gasPrice * BigInt(2), // 2x for max fee
        maxPriorityFeePerGas: gasPrice, // Base price for priority fee
      };
    }

    // Adjust EIP-1559 fees to 80% of current network fees
    const maxFeePerGas = feeData.maxFeePerGas * BigInt(80) / BigInt(100);
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(80) / BigInt(100);

    console.log('Adjusted EIP-1559 fees:', {
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    });

    return { maxFeePerGas, maxPriorityFeePerGas };
  } catch (error) {
    console.error('Error getting fee data:', error);
    throw new Error('Could not get fee data from network');
  }
}

async function checkGasFees(provider: ethers.Provider, botWallet: ethers.Wallet, dmcContract: ethers.Contract, toAddress: string, amount: bigint) {
  try {
    // Get gas estimate with fallback
    const gasEstimate = await estimateGasWithFallback(dmcContract, toAddress, amount);
    const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(provider);
    
    // Calculate maximum possible gas cost
    const totalGasCost = gasEstimate * maxFeePerGas;
    
    // Get bot's ETH balance
    const botBalance = await provider.getBalance(botWallet.address);
    
    console.log('Gas estimate:', gasEstimate.toString());
    console.log('Max fee per gas:', maxFeePerGas.toString());
    console.log('Max priority fee per gas:', maxPriorityFeePerGas.toString());
    console.log('Maximum total gas cost:', totalGasCost.toString());
    console.log('Bot ETH balance:', botBalance.toString());
    
    if (botBalance < totalGasCost) {
      throw new Error(`Insufficient ETH for gas fees. Required: ${ethers.formatEther(totalGasCost)} ETH, Available: ${ethers.formatEther(botBalance)} ETH`);
    }
    
    return { gasEstimate, maxFeePerGas, maxPriorityFeePerGas };
  } catch (error) {
    console.error('Error checking gas fees:', error);
    throw error;
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
    console.log(`Attempting to transfer ${dmcAmount} DMC tokens to ${buyerAddress}`);

    // Check bot's DMC balance with retries
    const botDMCBalance = await retryWithBackoff(() => dmcContract.balanceOf(botWallet.address));
    console.log(`Bot DMC balance: ${ethers.formatEther(botDMCBalance)} DMC`);

    if (botDMCBalance < dmcTokenAmount) {
      throw new Error("Insufficient DMC balance in bot wallet");
    }

    // Check gas fees and get optimized values
    const { gasEstimate, maxFeePerGas, maxPriorityFeePerGas } = await checkGasFees(provider, botWallet, dmcContract, buyerAddress, dmcTokenAmount);

    // Transfer DMC tokens to buyer with retries and EIP-1559 gas settings
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
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing transaction:', error);
    
    // Format the error message to be more user-friendly
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