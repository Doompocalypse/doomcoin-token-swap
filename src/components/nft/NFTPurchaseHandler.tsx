import { useToast } from "@/hooks/use-toast";
import { useContractInteractions } from "@/hooks/nft/useContractInteractions";
import { executePurchase } from "@/services/nft/purchaseService";

export const useNFTPurchaseHandler = (
  connectedAccount?: string,
  onInsufficientBalance?: () => void
) => {
  const { toast } = useToast();
  const { checkDMCBalance, approveDMC, approveNFT } = useContractInteractions(connectedAccount);

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

    try {
      // Check DMC balance
      const hasBalance = await checkDMCBalance(price);
      if (!hasBalance) {
        console.log("Purchase failed: Insufficient DMC balance");
        onInsufficientBalance?.();
        return;
      }

      // Get approvals
      const dmcApproved = await approveDMC(price);
      if (!dmcApproved) return;

      const nftApproved = await approveNFT();
      if (!nftApproved) return;

      // Execute purchase
      toast({
        title: "Purchase Initiated",
        description: "Please confirm the purchase transaction in your wallet",
      });

      const receipt = await executePurchase(nftId, price, connectedAccount);

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
    }
  };

  return {
    handlePurchase,
  };
};