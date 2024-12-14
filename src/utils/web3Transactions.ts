const BOT_WALLET = "0x2088891D40e755d83e1990d70fdb7e65a384e9B0";
const CONTRACT_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

export const handleTokenExchange = async (userAccount: string, ethValue: string) => {
  console.log("Initiating token exchange...");
  console.log("User wallet address:", userAccount);
  
  // Convert ETH amount to Wei (1 ETH = 10^18 Wei)
  const weiValue = BigInt(Math.floor(Number(ethValue) * 1e18)).toString(16);
  
  try {
    // User sends ETH to Bot Wallet
    const transactionParameters = {
      to: BOT_WALLET,
      from: userAccount,
      value: `0x${weiValue}`,
      data: "0x"
    };

    console.log("Transaction parameters:", transactionParameters);
    
    // Send ETH transaction
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    console.log("ETH Transaction hash:", txHash);

    // Call our Edge Function to process the DMC token transfer
    const response = await fetch('https://ylzqjxfbtlkmlxdopita.supabase.co/functions/v1/process-eth-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buyerAddress: userAccount,
        ethAmount: ethValue,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process DMC token transfer');
    }

    const result = await response.json();
    console.log("DMC transfer result:", result);

    return { txHash };
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
};