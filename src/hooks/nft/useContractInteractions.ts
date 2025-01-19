import { ethers } from "ethers";
import { createContractService } from "@/services/nft/contractService";
import { useToast } from "@/hooks/use-toast";

export const useContractInteractions = (connectedAccount?: string) => {
  const { toast } = useToast();

  const checkDMCBalance = async (price: number) => {
    console.log("Checking DMC balance for account:", connectedAccount);
    if (!connectedAccount) return false;

    try {
      const contractService = await createContractService();
      const balance = await contractService.checkDMCBalance(connectedAccount);
      const priceInWei = ethers.parseEther(price.toString());
      console.log("User DMC balance:", ethers.formatEther(balance));
      return balance >= priceInWei;
    } catch (error) {
      console.error("Error checking DMC balance:", error);
      return false;
    }
  };

  const approveDMC = async (price: number) => {
    console.log("Requesting DMC approval for price:", price);
    if (!connectedAccount) return false;

    try {
      const contractService = await createContractService();
      const priceInWei = ethers.parseEther(price.toString());
      
      toast({
        title: "Approval Required",
        description: "Please approve DMC token spending in your wallet",
      });
      
      const dmcApprovalTx = await contractService.approveDMC(connectedAccount, priceInWei);
      if (dmcApprovalTx.hash) {
        console.log("DMC approval transaction initiated:", dmcApprovalTx.hash);
        await dmcApprovalTx.wait();
        console.log("DMC approval confirmed");
        return true;
      }
      return false;
    } catch (error) {
      console.error("DMC approval error:", error);
      return false;
    }
  };

  const approveNFT = async () => {
    console.log("Requesting NFT contract approval");
    if (!connectedAccount) return false;

    try {
      const contractService = await createContractService();
      
      toast({
        title: "Approval Required",
        description: "Please approve NFT contract interaction in your wallet",
      });
      
      const nftApprovalTx = await contractService.approveNFT(connectedAccount);
      if (nftApprovalTx.hash) {
        console.log("NFT approval transaction initiated:", nftApprovalTx.hash);
        await nftApprovalTx.wait();
        console.log("NFT approval confirmed");
        return true;
      }
      return false;
    } catch (error) {
      console.error("NFT approval error:", error);
      return false;
    }
  };

  return {
    checkDMCBalance,
    approveDMC,
    approveNFT,
  };
};