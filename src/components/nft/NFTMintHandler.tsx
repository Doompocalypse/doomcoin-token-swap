import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { handleMetaMaskIntegration } from "./utils/metaMaskUtils";
import { recordMintInSupabase } from "./utils/supabaseUtils";
import { processMintTransaction } from "./utils/mintTransactionUtils";

export const useNFTMintHandler = (walletAddress?: string, contractAddress?: string) => {
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();

  const handleMint = async () => {
    if (!walletAddress || !contractAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet and ensure contract is deployed",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    try {
      console.log("Starting NFT minting process...");
      
      // Process the mint transaction and get token details
      const { tokenId, receipt } = await processMintTransaction(contractAddress);
      
      // Record the mint in Supabase
      await recordMintInSupabase(tokenId, walletAddress, contractAddress);
      
      // Add NFT to MetaMask
      await handleMetaMaskIntegration(tokenId, contractAddress);

      toast({
        title: "Success",
        description: `Successfully minted NFT with ID: ${tokenId}. Check your MetaMask NFTs tab to view it.`,
      });

      return tokenId;
    } catch (error: any) {
      console.error("Minting error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return { handleMint, isMinting };
};