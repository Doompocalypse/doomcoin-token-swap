import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import CleopatraNFTContract from "../../contracts/CleopatraNecklaceNFT.json";
import { supabase } from "@/integrations/supabase/client";

export const useNFTMintHandler = (connectedAccount?: string, contractAddress?: string) => {
  const { toast } = useToast();

  const handleMint = async () => {
    console.log("Starting NFT minting process...");
    console.log("Connected account:", connectedAccount);
    console.log("Contract address:", contractAddress);

    if (!connectedAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    if (!contractAddress) {
      toast({
        title: "Contract Required",
        description: "No contract address found. Please deploy the contract first.",
        variant: "destructive",
      });
      return;
    }

    if (!window.ethereum) {
      toast({
        title: "Error",
        description: "MetaMask is required to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create contract instance
      const contract = new ethers.Contract(
        contractAddress,
        CleopatraNFTContract.abi,
        signer
      );

      console.log("Initiating mint transaction...");
      const tx = await contract.mint();
      console.log("Mint transaction sent:", tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Mint transaction confirmed:", receipt);

      // Get the token ID from the event logs
      const mintEvent = receipt.events?.find(
        (event: any) => event.event === "Transfer" && 
        event.args.from === ethers.constants.AddressZero
      );

      if (!mintEvent) {
        throw new Error("Could not find mint event in transaction logs");
      }

      const tokenId = mintEvent.args.tokenId.toString();
      console.log("Minted token ID:", tokenId);

      // Record the mint in Supabase
      const { error: dbError } = await supabase
        .from('mock_purchases')
        .insert([
          { 
            nft_id: tokenId,
            buyer_address: connectedAccount,
            contract_address: contractAddress
          }
        ]);

      if (dbError) {
        console.error('Error recording mint:', dbError);
        // Don't throw here as the NFT was successfully minted
      }

      toast({
        title: "NFT Minted Successfully",
        description: `Token ID: ${tokenId}`,
      });

      return tokenId;
    } catch (error: any) {
      console.error("Minting error:", error);
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { handleMint };
};