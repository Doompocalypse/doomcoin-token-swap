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
      console.log("Mint transaction confirmed. Full receipt:", receipt);
      console.log("Number of events in receipt:", receipt.events?.length);
      
      // Log all events for debugging
      receipt.events?.forEach((event, index) => {
        console.log(`Event ${index}:`, {
          event: event.event,
          args: event.args,
          topics: event.topics,
          data: event.data
        });
      });

      // Log all transaction logs
      console.log("Transaction logs:", receipt.logs);

      // Look for Transfer event in all events
      const transferEvent = receipt.events?.find(event => {
        console.log("Checking event:", event);
        return (
          event.event === "Transfer" &&
          event.args &&
          event.args.from &&
          event.args.from === ethers.constants.AddressZero
        );
      });

      // If no Transfer event found, try parsing logs manually
      if (!transferEvent) {
        console.log("No Transfer event found in events, checking logs...");
        const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
        console.log("Transfer topic hash:", transferTopic);
        
        const log = receipt.logs.find(log => log.topics[0] === transferTopic);
        
        if (!log) {
          console.error("No Transfer log found in transaction");
          throw new Error("Could not find mint event in transaction. Please check the transaction on Etherscan for details.");
        }

        // Parse the log manually
        const iface = new ethers.utils.Interface(CleopatraNFTContract.abi);
        const parsedLog = iface.parseLog(log);
        console.log("Parsed transfer log:", parsedLog);
        
        if (!parsedLog.args.tokenId) {
          throw new Error("Could not find token ID in transaction logs");
        }

        const tokenId = parsedLog.args.tokenId.toString();
        console.log("Token ID from parsed log:", tokenId);

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

        toast({
          title: "Success",
          description: `Successfully minted NFT with ID: ${tokenId}`,
        });

        return tokenId;
      }

      const tokenId = transferEvent.args.tokenId.toString();
      console.log("Minted token ID:", tokenId);

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