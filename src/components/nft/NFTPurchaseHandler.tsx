import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useContractInteractions } from "@/hooks/nft/useContractInteractions";
import { purchaseNFT } from "@/services/nft/purchaseService";

export const useNFTPurchaseHandler = (
  connectedAccount?: string,
  onInsufficientBalance?: () => void
) => {
  const { toast } = useToast();
  const { checkBalance, transferDMC } = useContractInteractions();

  const handlePurchase = useCallback(
    async (tokenId: string, price: number) => {
      console.log("Starting NFT purchase process for token:", tokenId);

      if (!connectedAccount) {
        toast({
          title: "Wallet Connection Required",
          description: "Please connect your wallet to purchase NFTs",
          variant: "destructive",
        });
        return;
      }

      try {
        const hasBalance = await checkBalance(connectedAccount, price);
        if (!hasBalance) {
          console.log("Insufficient balance for purchase");
          onInsufficientBalance?.();
          return;
        }

        const success = await transferDMC(connectedAccount, price);
        if (!success) {
          toast({
            title: "Transaction Failed",
            description: "Failed to transfer DMC tokens",
            variant: "destructive",
          });
          return;
        }

        await purchaseNFT(tokenId, connectedAccount, price);

        toast({
          title: "Purchase Successful!",
          description: "You have successfully purchased the NFT",
        });
      } catch (error) {
        console.error("Error during purchase:", error);
        toast({
          title: "Purchase Failed",
          description: "There was an error processing your purchase",
          variant: "destructive",
        });
      }
    },
    [connectedAccount, checkBalance, transferDMC, toast, onInsufficientBalance]
  );

  return { handlePurchase };
};