import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import ReferralCodeDialog from "./ReferralCodeDialog";
import { ethers } from "ethers";

// Sepolia Testnet Addresses
const BOT_WALLET = "0x1D81C4D46302ef1866bda9f9c73962396968e054";
const DMC_CONTRACT = "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36";
const NFT_CONTRACT = "0x6890Fc38B996371366f845a73587722307EE54F7";
const EXCHANGE_CONTRACT = "0x529a7FdC52bb74cc0456D6d8E8693C22e2b28629";

const NFT_ABI = [
  "function mint(address to, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) view returns (bool)"
];

const DMC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

const EXCHANGE_ABI = [
  "function purchaseNFT(uint256 tokenId) external",
  "function setNFTPrice(uint256 tokenId, uint256 price) external"
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

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Initialize contracts
      const dmcContract = new ethers.Contract(DMC_CONTRACT, DMC_ABI, signer);
      const nftContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, signer);
      const exchangeContract = new ethers.Contract(EXCHANGE_CONTRACT, EXCHANGE_ABI, signer);

      // Check DMC balance
      const balance = await dmcContract.balanceOf(connectedAccount);
      const priceInWei = ethers.parseEther(price.toString());
      
      console.log("User DMC balance:", ethers.formatEther(balance), "Required:", price);
      
      if (balance < priceInWei) {
        console.log("Purchase failed: Insufficient DMC balance");
        onInsufficientBalance?.();
        return;
      }

      // Check and set DMC approval
      const allowance = await dmcContract.allowance(connectedAccount, EXCHANGE_CONTRACT);
      console.log("Current DMC allowance:", ethers.formatEther(allowance));
      
      if (allowance < priceInWei) {
        console.log("Approving DMC tokens for exchange contract...");
        try {
          const approveTx = await dmcContract.approve(EXCHANGE_CONTRACT, priceInWei);
          console.log("DMC approval transaction sent:", approveTx.hash);
          await approveTx.wait();
          console.log("DMC approval successful");
        } catch (error: any) {
          console.error("DMC approval failed:", error);
          throw new Error(`DMC approval failed: ${error.message}`);
        }
      }

      // Check and set NFT approval
      const isApproved = await nftContract.isApprovedForAll(connectedAccount, EXCHANGE_CONTRACT);
      console.log("NFT approval status:", isApproved);
      
      if (!isApproved) {
        console.log("Approving NFT contract for exchange...");
        try {
          const nftApproveTx = await nftContract.setApprovalForAll(EXCHANGE_CONTRACT, true);
          console.log("NFT approval transaction sent:", nftApproveTx.hash);
          await nftApproveTx.wait();
          console.log("NFT approval successful");
        } catch (error: any) {
          console.error("NFT approval failed:", error);
          throw new Error(`NFT approval failed: ${error.message}`);
        }
      }

      // Purchase NFT through exchange contract
      console.log("Executing NFT purchase through exchange contract...");
      let transactionHash: string;
      try {
        const purchaseTx = await exchangeContract.purchaseNFT(nftId);
        console.log("Purchase transaction sent:", purchaseTx.hash);
        const receipt = await purchaseTx.wait();
        console.log("NFT purchase successful:", receipt);
        transactionHash = receipt.hash;
      } catch (error: any) {
        console.error("Purchase transaction failed:", error);
        throw new Error(`Purchase transaction failed: ${error.message}`);
      }

      // Record the purchase
      const { error: purchaseError } = await supabase
        .from('nft_purchases')
        .insert({
          token_id: nftId,
          buyer_address: connectedAccount,
          transaction_hash: transactionHash,
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