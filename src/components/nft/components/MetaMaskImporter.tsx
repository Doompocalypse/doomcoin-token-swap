import { useToast } from "@/hooks/use-toast";

interface MetaMaskImporterProps {
  contractAddress: string;
  tokenId: string;
}

const MetaMaskImporter = async ({ contractAddress, tokenId }: MetaMaskImporterProps) => {
  const { toast } = useToast();

  try {
    console.log("Requesting NFT import to MetaMask...", {
      contractAddress,
      tokenId
    });
    
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC721',
        options: {
          address: contractAddress,
          tokenId: tokenId,
        },
      },
    });

    if (wasAdded) {
      console.log("NFT successfully added to MetaMask");
      toast({
        title: "Success",
        description: "NFT added to MetaMask",
      });
      return true;
    } else {
      console.log("User cancelled the NFT import");
      toast({
        title: "Cancelled",
        description: "User cancelled the import",
      });
      return false;
    }
  } catch (error) {
    console.error("Error importing to MetaMask:", error);
    toast({
      title: "Import Failed",
      description: "Failed to import NFT to MetaMask. Please verify you own this NFT.",
      variant: "destructive",
    });
    return false;
  }
};

export default MetaMaskImporter;