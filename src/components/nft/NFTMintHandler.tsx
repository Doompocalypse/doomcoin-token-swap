import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { useNFTStorage } from "@/hooks/nft/useNFTStorage";
import { useNFTContract } from "@/hooks/nft/useNFTContract";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const ToastWithCopy = ({ message, hash }: { message: string; hash?: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(hash || message);
  };

  return (
    <div className="flex items-start justify-between gap-2">
      <p className="break-all select-text">{message}</p>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleCopy}
        className="h-6 w-6 shrink-0"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const useNFTMintHandler = (connectedAccount?: string, contractAddress?: string) => {
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
        description: <ToastWithCopy message="Please wait while your NFT is being minted..." hash={tx.hash} />,
      });

      const receipt = await tx.wait();
      console.log("Mint transaction confirmed. Full receipt:", receipt);

      // Record the mint in Supabase
      await recordMintInSupabase("1", connectedAccount, contractAddress);
      
      toast({
        title: "NFT Minted Successfully",
        description: <ToastWithCopy message="Your NFT has been minted! Check your wallet to view it." hash={tx.hash} />,
      });

    } catch (error: any) {
      console.error("Minting error:", error);
      
      if (error.code === "ACTION_REJECTED") {
        toast({
          title: "Transaction Cancelled",
          description: <ToastWithCopy message="You cancelled the transaction. No NFT was minted." />,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Minting Failed",
        description: <ToastWithCopy 
          message={error.message || "Failed to mint NFT. Please try again."} 
          hash={error.transactionHash} 
        />,
        variant: "destructive",
      });
      throw error;
    }
  };

  return { handleMint };
};