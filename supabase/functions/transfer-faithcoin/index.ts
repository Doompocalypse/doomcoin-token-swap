import { ethers } from 'https://esm.sh/ethers@6.11.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Network configurations
const NETWORKS = {
  sepolia: {
    name: 'Sepolia',
    chainId: '0xaa36a7',
    rpcUrl: (apiKey: string) => `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`,
    faithcoinAddress: '0xaAcfFDe6fdb5B4eAF0aa3a66e15BcF8064839Fc4',
    botWallet: '0x2088891D40e755d83e1990d70fdb7e65a384e9B0'
  },
  arbitrum: {
    name: 'Arbitrum One',
    chainId: '0xa4b1',
    rpcUrl: (apiKey: string) => `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`,
    faithcoinAddress: '0xaAcfFDe6fdb5B4eAF0aa3a66e15BcF8064839Fc4',
    botWallet: '0x2088891D40e755d83e1990d70fdb7e65a384e9B0'
  }
};

// Faithcoin Token Contract ABI (expanded with more details)
const FAITHCOIN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toAddress, amount, network = 'sepolia' } = await req.json();
    const networkConfig = NETWORKS[network as keyof typeof NETWORKS];
    
    if (!networkConfig) {
      throw new Error(`Unsupported network: ${network}`);
    }

    console.log(`Processing Faithcoin transfer on ${networkConfig.name}`);
    console.log(`To address: ${toAddress}`);
    console.log(`Amount: ${amount} Faithcoin`);
    console.log(`Contract address: ${networkConfig.faithcoinAddress}`);

    const alchemyApiKey = Deno.env.get("ALCHEMY_API_KEY");
    if (!alchemyApiKey) {
      throw new Error("Alchemy API key not configured");
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl(alchemyApiKey));
    const botPrivateKey = Deno.env.get("BOT_WALLET_PRIVATE_KEY");
    
    if (!botPrivateKey) {
      throw new Error("Bot wallet private key not configured");
    }

    // Initialize wallet with retries
    const botWallet = await retryWithBackoff(async () => {
      const wallet = new ethers.Wallet(botPrivateKey, provider);
      // Test connection
      await provider.getBalance(wallet.address);
      return wallet;
    });

    console.log("Bot wallet initialized:", botWallet.address);
    console.log(`Network: ${networkConfig.name}`);

    const faithcoinContract = new ethers.Contract(
      networkConfig.faithcoinAddress,
      FAITHCOIN_ABI,
      botWallet
    );

    // Verify contract exists and is accessible
    try {
      const name = await faithcoinContract.name();
      const symbol = await faithcoinContract.symbol();
      console.log(`Connected to Faithcoin contract: ${name} (${symbol})`);
    } catch (error) {
      console.error('Error accessing Faithcoin contract:', error);
      throw new Error(`Could not access Faithcoin contract at ${networkConfig.faithcoinAddress}. Please verify the contract address and deployment.`);
    }

    const faithcoinAmount = ethers.parseEther(amount);
    
    // Check bot's Faithcoin balance with better error handling
    let botBalance;
    try {
      botBalance = await retryWithBackoff(() => 
        faithcoinContract.balanceOf(botWallet.address)
      );
      console.log(`Bot Faithcoin balance: ${ethers.formatEther(botBalance)} Faithcoin`);
    } catch (error) {
      console.error('Error checking bot balance:', error);
      throw new Error('Failed to check bot wallet Faithcoin balance. Please verify the contract implementation.');
    }

    if (botBalance < faithcoinAmount) {
      throw new Error(`Insufficient Faithcoin balance in bot wallet. Available: ${ethers.formatEther(botBalance)} Faithcoin`);
    }

    // Send Faithcoin tokens with retries
    const tx = await retryWithBackoff(() => 
      faithcoinContract.transfer(toAddress, faithcoinAmount)
    );
    
    console.log("Transaction sent:", tx.hash);
    
    const receipt = await retryWithBackoff(() => tx.wait());
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    return new Response(
      JSON.stringify({
        success: true,
        network: networkConfig.name,
        transactionHash: receipt.hash,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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
    );
  }
});