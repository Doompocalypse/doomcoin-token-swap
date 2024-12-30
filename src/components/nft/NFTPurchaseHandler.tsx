import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import ReferralCodeDialog from "./ReferralCodeDialog";
import { ethers } from "ethers";

const NFT_ABI = [
  "function mint(address to, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
];

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
    console.log("Starting NFT purchase flow:", { nftId, price });
    
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
        console.log("Purchase failed: Insufficient DMC balance");
        onInsufficientBalance?.();
        return;
      }

      // 2. Process the DMC payment
      console.log("Processing DMC payment...");
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

      // 3. Mint NFT to user's wallet
      console.log("Initiating NFT minting...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const { data: contractAddress } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'nft_contract_address')
        .single();
      
      if (!contractAddress) {
        throw new Error('NFT contract address not found');
      }

      const nftContract = new ethers.Contract(
        contractAddress.value,
        NFT_ABI,
        signer
      );

      console.log("Minting NFT with contract:", contractAddress.value);
      const mintTx = await nftContract.mint(connectedAccount, nftId);
      const receipt = await mintTx.wait();
      
      console.log("NFT minted successfully:", receipt);

      // 4. Record the NFT purchase
      console.log("Recording purchase in database...");
      const { error: purchaseError } = await supabase
        .from('nft_purchases')
        .insert({
          token_id: nftId,
          buyer_address: connectedAccount,
          transaction_hash: receipt.hash,
          price_paid: price
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