import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import ReferralCodeDialog from "./ReferralCodeDialog";

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
    if (!connectedAccount) {
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
      console.log("Processing NFT purchase:", { nftId, price, connectedAccount });

      // 1. Check DMC balance
      const { data: balanceData, error: balanceError } = await supabase.functions.invoke('get-dmc-balance', {
        body: { address: connectedAccount }
      });
      
      if (balanceError) {
        console.error("Error fetching DMC balance:", balanceError);
        throw new Error('Failed to check DMC balance');
      }

      const balance = balanceData.balance;
      console.log("User DMC balance:", balance, "Required:", price);
      
      if (balance < price) {
        console.log("Insufficient DMC balance");
        onInsufficientBalance?.();
        return;
      }

      // 2. Process the DMC payment
      const { data: transferData, error: transferError } = await supabase.functions.invoke('process-eth-transaction', {
        body: {
          buyerAddress: connectedAccount,
          ethAmount: "0", // No ETH involved in this transaction
          dmcAmount: price.toString()
        }
      });

      if (transferError) {
        console.error("DMC transfer error:", transferError);
        throw new Error('Failed to process DMC transfer');
      }

      console.log("DMC transfer successful:", transferData);

      // 3. Record the NFT purchase
      const { error: purchaseError } = await supabase
        .from('mock_purchases')
        .insert({
          nft_id: nftId,
          buyer_address: connectedAccount,
          contract_address: "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073"
        });

      if (purchaseError) {
        console.error("Purchase recording error:", purchaseError);
        throw purchaseError;
      }

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased this NFT!",
      });

      // Invalidate NFT cache to refresh the UI
      window.location.reload();
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPendingPurchase(null);
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