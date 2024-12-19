import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";
import { supabase } from "@/integrations/supabase/client";

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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(
        contractAddress,
        CleopatraNFTContract.abi,
        signer
      );

      console.log("Minting NFT...");
      const tx = await contract.mint();
      console.log("Mint transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Mint transaction confirmed:", receipt);

      // Get the token ID from the mint event
      const mintEvent = receipt.events?.find(
        (event: any) => event.event === "Transfer" && 
        event.args.from === ethers.constants.AddressZero
      );

      if (!mintEvent) {
        throw new Error("Could not find mint event in transaction");
      }

      const tokenId = mintEvent.args.tokenId.toString();
      console.log("Minted token ID:", tokenId);

      // Record the mint in Supabase
      const { error: dbError } = await supabase
        .from('mock_purchases')
        .insert([{ 
          nft_id: tokenId,
          buyer_address: walletAddress,
          contract_address: contractAddress
        }]);

      if (dbError) {
        console.error('Error recording mint:', dbError);
        // Don't throw here as the NFT was successfully minted
      }

      toast({
        title: "Success",
        description: `Successfully minted NFT with ID: ${tokenId}`,
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