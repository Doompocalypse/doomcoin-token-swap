import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ReferralCodeDialog from "./ReferralCodeDialog";
import { createContractService } from "@/services/nft/contractService";
import { recordPurchase } from "@/services/nft/purchaseRecordService";
import { ethers } from "ethers";

export const useNFTPurchaseHandler = (
  connectedAccount?: string,
  onInsufficientBalance?: () => void
) => {
  const { toast } = useToast();
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<{
    nftId: string;
    price: number;
  } | null>(null);

  const handlePurchase = async (nftId: string, price: number) => {
    console.log("Starting NFT purchase flow:", { 
      nftId, 
      price, 
      network: "Sepolia Testnet",
      connectedAccount 
    });
    
    if (!connectedAccount) {
      console.log("Purchase failed: No wallet connected");
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase NFTs",
        variant: "destructive",
      });
      return;
    }

    setPendingPurchase({ nftId, price });
    setShowReferralDialog(true);
  };

  const processPurchase = async () => {
    if (!pendingPurchase || !connectedAccount) return;
    const { nftId, price } = pendingPurchase;

    try {
      console.log("Processing NFT purchase on Sepolia:", { 
        nftId, 
        price, 
        connectedAccount,
        priceInWei: ethers.parseEther(price.toString()).toString()
      });
      
      const contractService = await createContractService();
      const priceInWei = ethers.parseEther(price.toString());
      
      // Check DMC balance
      console.log("Checking DMC balance...");
      const balance = await contractService.checkDMCBalance(connectedAccount);
      console.log("DMC Balance:", ethers.formatEther(balance), "DMC");
      
      if (balance < priceInWei) {
        console.log("Purchase failed: Insufficient DMC balance", {
          required: ethers.formatEther(priceInWei),
          available: ethers.formatEther(balance)
        });
        onInsufficientBalance?.();
        return;
      }

      // Handle DMC approval
      console.log("Requesting DMC token approval...");
      await contractService.approveDMC(connectedAccount, priceInWei);
      console.log("DMC approval successful");

      // Handle NFT approval
      console.log("Requesting NFT contract approval...");
      await contractService.approveNFT(connectedAccount);
      console.log("NFT approval successful");

      // Purchase NFT
      console.log("Executing NFT purchase transaction...");
      const transactionHash = await contractService.purchaseNFT(connectedAccount, nftId);
      console.log("Purchase transaction successful:", transactionHash);

      // Record the purchase
      console.log("Recording purchase in database...");
      await recordPurchase(nftId, connectedAccount, transactionHash, price);
      console.log("Purchase recorded successfully");

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased this NFT!",
      });

      // Refresh the UI
      window.location.reload();
    } catch (error: any) {
      console.error('Purchase error details:', {
        error: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack
      });
      
      let errorMessage = "Failed to purchase NFT. ";
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage += "Insufficient ETH for gas fees.";
      } else if (error.code === 'ACTION_REJECTED') {
        errorMessage += "Transaction was rejected.";
      } else if (error.message.includes("user rejected")) {
        errorMessage += "You rejected the transaction.";
      } else {
        errorMessage += error.message || "Please try again.";
      }
      
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPendingPurchase(null);
      setShowReferralDialog(false);
    }
  };

  const handleReferralComplete = async (isValid: boolean) => {
    console.log("Referral completion handler called, valid:", isValid);
    await processPurchase();
  };

  return {
    handlePurchase,
    ReferralDialog: showReferralDialog && connectedAccount ? (
      <ReferralCodeDialog
        isOpen={showReferralDialog}
        onClose={() => setShowReferralDialog(false)}
        onSubmit={handleReferralComplete}
        userAddress={connectedAccount}
      />
    ) : null,
  };
};