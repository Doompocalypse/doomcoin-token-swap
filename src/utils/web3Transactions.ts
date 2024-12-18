import { queueTransaction } from "./queue/transactionQueue";

const BOT_WALLET = "0x2088891D40e755d83e1990d70fdb7e65a384e9B0";

export const handleTokenExchange = async (userAccount: string, ethValue: string, usdAmount: string) => {
  console.log("Queueing token exchange transaction...");
  console.log("User wallet address:", userAccount);
  console.log("ETH amount to send:", ethValue);
  console.log("USD value (DMC tokens to receive):", usdAmount);
  
  return queueTransaction(async () => {
    try {
      const ethAmount = parseFloat(ethValue);
      if (isNaN(ethAmount) || ethAmount <= 0) {
        throw new Error("Invalid ETH amount");
      }

      const weiValue = BigInt(Math.floor(ethAmount * 1e18));
      console.log("Wei value for transaction:", weiValue.toString());
      
      const hexValue = weiValue.toString(16);
      console.log("Hex value for transaction:", hexValue);

      const transactionParameters = {
        to: BOT_WALLET,
        from: userAccount,
        value: `0x${hexValue}`,
        data: "0x",
      };

      console.log("Transaction parameters:", transactionParameters);
      
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log("ETH Transaction hash:", txHash);

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