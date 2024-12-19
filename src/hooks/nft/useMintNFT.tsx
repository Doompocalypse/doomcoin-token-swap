import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { useNFTStorage } from "@/hooks/nft/useNFTStorage";
import { useNFTContract } from "@/hooks/nft/useNFTContract";
import { findTransferEvent, validateTransferEvent } from "@/utils/nft/transactionUtils";
import CopyToast from "@/components/nft/components/CopyToast";
import React from 'react';

interface MintError extends Error {
  code?: string;
  transactionHash?: string;
}

export const useMintNFT = (connectedAccount?: string, contractAddress?: string) => {
  const { toast } = useToast();
  const { recordMintInSupabase } = useNFTStorage();
  const { getContract } = useNFTContract();

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
      const contract = getContract(contractAddress, signer);

      console.log("Initiating mint transaction...");
      const tx = await contract.mint();
      console.log("Mint transaction sent:", tx.hash);

      toast({
        title: "Transaction Pending",
        description: React.createElement(CopyToast, {
          message: "Please wait while your NFT is being minted...",
          hash: tx.hash
        })
      });

      const receipt = await tx.wait();
      console.log("Mint transaction confirmed. Full receipt:", receipt);

      const transferEvent = findTransferEvent(receipt);
      validateTransferEvent(transferEvent, receipt);

      if (!transferEvent?.args?.tokenId) {
        throw new Error(`Transaction succeeded but token ID was not found. Transaction Hash: ${receipt.transactionHash}`);
      }

      const tokenId = transferEvent.args.tokenId.toString();
      console.log("Minted token ID:", tokenId);

      await recordMintInSupabase(tokenId, connectedAccount, contractAddress);

      toast({
        title: "NFT Minted Successfully",
        description: React.createElement(CopyToast, {
          message: `Token ID: ${tokenId}`,
          hash: tokenId
        })
      });

      return tokenId;
    } catch (error: unknown) {
      const mintError = error as MintError;
      console.error("Minting error:", mintError);
      
      if (mintError.code === "ACTION_REJECTED") {
        toast({
          title: "Transaction Cancelled",
          description: React.createElement(CopyToast, {
            message: "You cancelled the transaction. No NFT was minted."
          }),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Minting Failed",
        description: React.createElement(CopyToast, {
          message: mintError.message || "Failed to mint NFT. Please try again.",
          hash: mintError.transactionHash
        }),
        variant: "destructive",
      });
      throw mintError;
    }
  };

  return { handleMint };
};