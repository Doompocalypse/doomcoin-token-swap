import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import ReferralCodeDialog from "./ReferralCodeDialog";
import { ethers } from "ethers";

const NFT_ABI = [
  "function mint(address to, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
];

const DMC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

const BOT_WALLET = "0x1D81C4D46302ef1866bda9f9c73962396968e054";
const DMC_CONTRACT = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

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

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Initialize DMC token contract
      const dmcContract = new ethers.Contract(DMC_CONTRACT, DMC_ABI, signer);

      // Check DMC balance
      const balance = await dmcContract.balanceOf(connectedAccount);
      const priceInWei = ethers.parseEther(price.toString());
      
      console.log("User DMC balance:", ethers.formatEther(balance), "Required:", price);
      
      if (balance < priceInWei) {
        console.log("Purchase failed: Insufficient DMC balance");
        onInsufficientBalance?.();
        return;
      }

      // Transfer DMC tokens to bot wallet
      console.log("Transferring DMC tokens to bot wallet...");
      const transferTx = await dmcContract.transfer(BOT_WALLET, priceInWei);
      const transferReceipt = await transferTx.wait();
      
      console.log("DMC transfer successful:", transferReceipt.hash);

      // Get NFT contract address
      const { data: contractAddress } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'nft_contract_address')
        .single();
      
      if (!contractAddress) {
        throw new Error('NFT contract address not found');
      }

      // Mint NFT
      console.log("Minting NFT...");
      const nftContract = new ethers.Contract(
        contractAddress.value,
        NFT_ABI,
        signer
      );

      const mintTx = await nftContract.mint(connectedAccount, nftId);
      const receipt = await mintTx.wait();
      
      console.log("NFT minted successfully:", receipt.hash);

      // Record the purchase
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