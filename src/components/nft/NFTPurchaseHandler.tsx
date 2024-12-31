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
    console.log("Starting NFT purchase flow:", { nftId, price, network: "Sepolia Testnet" });
    
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
      console.log("Processing NFT purchase on Sepolia:", { nftId, price, connectedAccount });
      
      const contractService = await createContractService();
      const priceInWei = ethers.parseEther(price.toString());
      
      // Check DMC balance
      const balance = await contractService.checkDMCBalance(connectedAccount);
      if (balance < priceInWei) {
        console.log("Purchase failed: Insufficient DMC balance");
        onInsufficientBalance?.();
        return;
      }

      // Handle approvals
      await contractService.approveDMC(connectedAccount, priceInWei);
      await contractService.approveNFT(connectedAccount);

      // Purchase NFT
      const transactionHash = await contractService.purchaseNFT(connectedAccount, nftId);

      // Record the purchase
      await recordPurchase(nftId, connectedAccount, transactionHash, price);

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased this NFT!",
      });

      // Refresh the UI
      window.location.reload();
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase NFT. Please try again.",
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