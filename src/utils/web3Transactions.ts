import { parseEther } from 'viem';
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi';

const BOT_WALLET = "0x2088891D40e755d83e1990d70fdb7e65a384e9B0";
const CONTRACT_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

export const handleTokenExchange = async (userAccount: string, ethValue: string, usdAmount: string) => {
  console.log("Initiating token exchange...");
  console.log("User wallet address:", userAccount);
  console.log("ETH amount to send:", ethValue);
  console.log("USD value (DMC tokens to receive):", usdAmount);
  
  try {
    const weiValue = parseEther(ethValue);
    
    const { hash } = await useSendTransaction({
      to: BOT_WALLET,
      value: weiValue,
    });

    console.log("ETH Transaction hash:", hash);

    // Call our Edge Function to process the DMC token transfer
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
      throw new Error('Failed to process DMC token transfer');
    }

    const result = await response.json();
    console.log("DMC transfer result:", result);

    return { txHash: hash };
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
};