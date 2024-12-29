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
      // Check DMC balance using Supabase function invoke
      const { data, error: balanceError } = await supabase.functions.invoke('get-dmc-balance', {
        body: { address: connectedAccount }
      });
      
      if (balanceError) {
        console.error("Error fetching DMC balance:", balanceError);
        throw balanceError;
      }

      const balance = data.balance;
      console.log("User DMC balance:", balance, "Required:", price);
      
      if (balance < price) {
        console.log("Insufficient DMC balance");
        onInsufficientBalance?.();
        return;
      }

      const { error } = await supabase
        .from('mock_purchases')
        .insert({
          nft_id: nftId,
          buyer_address: connectedAccount,
          contract_address: "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073"
        });

      if (error) throw error;

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased this NFT!",
      });
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