import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

interface MetaMaskImporterProps {
  contractAddress: string;
  tokenId: string;
}

// Define the type for wallet_watchAsset parameters
interface WatchAssetParams {
  type: 'ERC721';
  options: {
    address: string;
    tokenId: string;
    image: string;
    name: string;
    description: string;
  };
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

    // First verify ERC721 interface support
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

    // Get current connected account
    const accounts = await provider.listAccounts();
    if (!accounts[0]) {
      console.error("No wallet connected");
      toast({
        title: "Import Failed",
        description: "No wallet connected",
        variant: "destructive",
      });
      return false;
    }

    // Verify token ownership
    try {
      const owner = await contract.ownerOf(tokenId);
      console.log("Token owner:", owner);
      console.log("Current account:", accounts[0]);
      
      if (owner.toLowerCase() !== accounts[0].toLowerCase()) {
        console.error("Token ownership verification failed");
        toast({
          title: "Import Failed",
          description: "You don't own this NFT",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Token ownership verification failed:", error);
      toast({
        title: "Import Failed",
        description: "Failed to verify token ownership",
        variant: "destructive",
      });
      return false;
    }

    // Get token metadata URL
    const tokenURI = await contract.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);

    // Fetch metadata from our edge function
    const response = await fetch(`${tokenURI}?tokenId=${tokenId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch token metadata');
    }
    
    const metadata = await response.json();
    console.log("Token metadata:", metadata);

    // Request MetaMask to watch the asset with proper typing
    const watchAssetParams: WatchAssetParams = {
      type: 'ERC721',
      options: {
        address: contractAddress,
        tokenId: tokenId,
        image: metadata.image,
        name: metadata.name,
        description: metadata.description
      },
    };

    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: watchAssetParams,
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
  } catch (error: any) {
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