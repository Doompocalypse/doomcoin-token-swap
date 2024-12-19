import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";
import { supabase } from "@/integrations/supabase/client";
import { findTransferEvent, validateTransferEvents } from "@/utils/nft/transactionUtils";

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

    const totalSupply = await contract.totalSupply();
    const nextTokenId = totalSupply.toNumber() + 1;
    console.log(`Next NFT to be minted will be Token ID: ${nextTokenId}`);

    if (nextTokenId > 6) {
      toast({
        title: "Collection Limit Reached",
        description: "All individual pieces (1-6) have been minted. Only the complete set (Token ID 7) remains.",
        variant: "destructive",
      });
      setIsMinting(false);
      return;
    }

    console.log("Minting NFT...");
    const tx = await contract.mint();
    console.log("Mint transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Mint transaction confirmed. Full receipt:", receipt);
    
    const transferEvents = findTransferEvent(receipt);
    console.log("Found transfer events:", transferEvents);
    
    const validEvents = validateTransferEvents(transferEvents, receipt);
    console.log("Validated transfer events:", validEvents);
    
    if (validEvents.length === 0) {
      throw new Error("No valid transfer events found in transaction");
    }
    
    const tokenId = validEvents[0].args.tokenId.toString();
    console.log("Successfully parsed token ID:", tokenId);

    // Generate a UUID for Supabase storage
    const uuid = crypto.randomUUID();
    console.log("Generated UUID for storage:", uuid);

    // Record the mint in Supabase
    const { error: dbError } = await supabase
      .from('mock_purchases')
      .insert([{ 
        id: uuid,
        nft_id: uuid,
        buyer_address: walletAddress,
        contract_address: contractAddress
      }]);

    if (dbError) {
      console.error('Error recording mint:', dbError);
    }

    // Add NFT to MetaMask
    try {
      const tokenURI = await contract.tokenURI(tokenId);
      console.log("Token URI:", tokenURI);
      
      const response = await fetch(`${tokenURI}?tokenId=${tokenId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch token metadata');
      }
      
      const metadata = await response.json();
      console.log("Token metadata:", metadata);

      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: [{
          type: 'ERC721',
          options: {
            address: contractAddress,
            tokenId: tokenId,
            image: metadata.image,
            name: metadata.name,
            description: metadata.description
          },
        }],
      });

      if (wasAdded) {
        console.log("NFT successfully added to MetaMask");
      }
    } catch (error) {
      console.error("Error adding NFT to MetaMask:", error);
    }

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
