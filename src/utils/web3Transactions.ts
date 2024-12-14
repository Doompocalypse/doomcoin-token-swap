const BOT_WALLET = "0x2088891D40e755d83e1990d70fdb7e65a384e9B0";
const CONTRACT_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

export const handleTokenExchange = async (userAccount: string, ethValue: string) => {
  console.log("Initiating token exchange...");
  console.log("User wallet address:", userAccount);
  
  // Convert ETH amount to Wei (1 ETH = 10^18 Wei)
  const weiValue = BigInt(Math.floor(Number(ethValue) * 1e18)).toString(16);
  
  try {
    // First transaction: User sends ETH to Bot Wallet
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

    // Create ERC20 transfer data (function signature + parameters)
    const transferData = `0xa9059cbb${userAccount.slice(2).padStart(64, '0')}${weiValue.padStart(64, '0')}`;

    // Second transaction: Bot sends tokens to user
    const tokenTransactionParameters = {
      from: BOT_WALLET,
      to: CONTRACT_ADDRESS,
      data: transferData,
      value: "0x0"
    };

    console.log("Token transaction parameters:", tokenTransactionParameters);

    // Send token transaction
    const tokenTxHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tokenTransactionParameters],
    });

    console.log("Token Transaction hash:", tokenTxHash);

    return { txHash, tokenTxHash };
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
};