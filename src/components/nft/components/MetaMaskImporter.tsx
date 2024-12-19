import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

interface MetaMaskImporterProps {
  contractAddress: string;
  tokenId: string;
}

const MetaMaskImporter = async ({ contractAddress, tokenId }: MetaMaskImporterProps) => {
  const { toast } = useToast();

  try {
    console.log("Starting NFT import process...", {
      contractAddress,
      tokenId,
      timestamp: new Date().toISOString()
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      CleopatraNFTContract.abi,
      provider
    );

    // Verify ERC721 interface support
    const isERC721 = await contract.supportsInterface('0x80ac58cd');
    console.log("Contract ERC721 support:", isERC721);
    
    if (!isERC721) {
      console.error("Contract does not support ERC721 interface");
      toast({
        title: "Import Failed",
        description: "Contract does not support the ERC721 standard",
        variant: "destructive",
      });
      return false;
    }

    // Get token URI to verify token exists and get metadata
    try {
      const tokenURI = await contract.tokenURI(tokenId);
      console.log("Token URI verified:", tokenURI);
    } catch (error) {
      console.error("Token URI verification failed:", error);
      toast({
        title: "Import Failed",
        description: "This token ID does not exist",
        variant: "destructive",
      });
      return false;
    }

    console.log("Requesting NFT import to MetaMask...");
    
    // MetaMask's wallet_watchAsset API for ERC721 tokens with complete parameters
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: [{
        type: 'ERC721',
        options: {
          address: contractAddress,
          tokenId: tokenId,
          name: await contract.name(),
          symbol: await contract.symbol(),
          tokenURI: await contract.tokenURI(tokenId),
        },
      }]
    });

    if (wasAdded) {
      console.log("NFT successfully added to MetaMask");
      toast({
        title: "Success",
        description: "NFT added to MetaMask. Check your NFTs tab to view it.",
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
    console.error("Error importing to MetaMask:", {
      error,
      contractAddress,
      tokenId,
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: "Import Failed",
      description: error.message || "Failed to import NFT to MetaMask",
      variant: "destructive",
    });
    return false;
  }
};

export default MetaMaskImporter;