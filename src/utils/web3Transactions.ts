const BOT_WALLET = "0x2088891D40e755d83e1990d70fdb7e65a384e9B0";
const CONTRACT_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

export const handleTokenExchange = async (userAccount: string, ethValue: string) => {
  console.log("Initiating token exchange...");
  console.log("User wallet address:", userAccount);
  
  // First request account access
  try {
    await window.ethereum.request({ 
      method: 'eth_requestAccounts'
    });
  } catch (error) {
    console.error("Failed to get account authorization:", error);
    throw new Error("Please authorize your wallet to proceed with the transaction");
  }
  
  // Convert ETH amount to Wei (1 ETH = 10^18 Wei)
  const weiValue = BigInt(Math.floor(Number(ethValue) * 1e18)).toString(16);
  
  // Create transaction parameters for ETH transfer FROM USER to Bot Wallet
  const transactionParameters = {
    from: userAccount, // User's connected wallet
    to: BOT_WALLET, // Bot Wallet address
    value: `0x${weiValue}`, // Value in Wei (hexadecimal)
    data: "0x", // No additional data needed for basic ETH transfer
  };

  console.log("Transaction parameters:", transactionParameters);

  // Send ETH transaction
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });

  console.log("ETH Transaction hash:", txHash);

  // Create ERC20 transfer data
  const transferAmount = BigInt(Math.floor(Number(ethValue) * 1e18)).toString(16);
  const transferData = `0xa9059cbb${userAccount.slice(2).padStart(64, '0')}${transferAmount.padStart(64, '0')}`;

  // Create transaction parameters for token transfer FROM BOT to USER
  const tokenTransactionParameters = {
    from: BOT_WALLET, // Bot Wallet
    to: CONTRACT_ADDRESS, // DoomCoin Contract
    data: transferData,
    value: "0x0" // No ETH value for token transfer
  };

  console.log("Token transaction parameters:", tokenTransactionParameters);

  // Send token transaction
  const tokenTxHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tokenTransactionParameters],
  });

  console.log("Token Transaction hash:", tokenTxHash);

  return { txHash, tokenTxHash };
};