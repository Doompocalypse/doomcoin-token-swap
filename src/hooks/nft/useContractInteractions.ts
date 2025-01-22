import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { BOT_WALLET, RESERVE_WALLET, DMC_CONTRACT } from "@/utils/contractAddresses";

const DMC_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export const useContractInteractions = () => {
  const { toast } = useToast();

  const checkBalance = async (account: string, price: number): Promise<boolean> => {
    console.log("Checking DMC balance for account:", account);
    
    try {
      if (!window.ethereum) throw new Error("No Web3 provider found");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const dmcContract = new ethers.Contract(DMC_CONTRACT, DMC_ABI, provider);
      
      const balance = await dmcContract.balanceOf(account);
      const priceInWei = ethers.parseEther(price.toString());
      
      console.log("User DMC balance:", ethers.formatEther(balance));
      return balance >= priceInWei;
    } catch (error) {
      console.error("Error checking DMC balance:", error);
      return false;
    }
  };

  const transferDMC = async (account: string, amount: number): Promise<boolean> => {
    console.log("Initiating DMC transfer for amount:", amount);
    
    try {
      if (!window.ethereum) throw new Error("No Web3 provider found");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const dmcContract = new ethers.Contract(DMC_CONTRACT, DMC_ABI, signer);
      
      const amountInWei = ethers.parseEther(amount.toString());
      
      // First check and request approval if needed
      const allowance = await dmcContract.allowance(account, RESERVE_WALLET);
      if (allowance < amountInWei) {
        console.log("Requesting DMC approval");
        const approveTx = await dmcContract.approve(RESERVE_WALLET, amountInWei);
        await approveTx.wait();
      }
      
      // Transfer DMC tokens
      console.log("Transferring DMC tokens to Reserve Wallet");
      const transferTx = await dmcContract.transfer(RESERVE_WALLET, amountInWei);
      await transferTx.wait();
      
      return true;
    } catch (error) {
      console.error("Error transferring DMC:", error);
      return false;
    }
  };

  return {
    checkBalance,
    transferDMC
  };
};