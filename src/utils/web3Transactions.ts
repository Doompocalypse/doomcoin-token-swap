const BOT_WALLET = "0x2088891D40e755d83e1990d70fdb7e65a384e9B0";
const CONTRACT_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

// Transaction queue implementation
let isProcessing = false;
const transactionQueue: Array<() => Promise<any>> = [];

const processQueue = async () => {
  if (isProcessing || transactionQueue.length === 0) return;
  
  isProcessing = true;
  console.log("Processing next transaction in queue...");
  
  try {
    const nextTransaction = transactionQueue.shift();
    if (nextTransaction) {
      await nextTransaction();
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
  } finally {
    isProcessing = false;
    if (transactionQueue.length > 0) {
      await processQueue();
    }
  }
};

const queueTransaction = async (transactionFn: () => Promise<any>) => {
  return new Promise((resolve, reject) => {
    transactionQueue.push(async () => {
      try {
        const result = await transactionFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};

export const handleTokenExchange = async (userAccount: string, ethValue: string, usdAmount: string) => {
  console.log("Queueing token exchange transaction...");
  console.log("User wallet address:", userAccount);
  console.log("ETH amount to send:", ethValue);
  console.log("USD value (DMC tokens to receive):", usdAmount);
  
  return queueTransaction(async () => {
    // Convert ETH amount to Wei (1 ETH = 10^18 Wei)
    const weiValue = BigInt(Math.floor(Number(ethValue) * 1e18)).toString(16);
    
    try {
      // User sends ETH to Bot Wallet with exact amount
      const transactionParameters = {
        to: BOT_WALLET,
        from: userAccount,
        value: `0x${weiValue}`,
        data: "0x",
        // Add gas parameters to ensure transaction uses exact amount
        gas: undefined,
        gasPrice: undefined
      };

      console.log("Transaction parameters:", transactionParameters);
      
      // Send ETH transaction with exact amount
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log("ETH Transaction hash:", txHash);

      // Call our Edge Function to process the DMC token transfer using the correct URL format
      const response = await fetch('https://ylzqjxfbtlkmlxdopita.supabase.co/functions/v1/process-eth-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerAddress: userAccount,
          ethAmount: ethValue,
          dmcAmount: usdAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Edge function error:", errorData);
        throw new Error(errorData.message || 'Failed to process DMC token transfer');
      }

      const result = await response.json();
      console.log("DMC transfer result:", result);

      return { txHash };
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  });
};