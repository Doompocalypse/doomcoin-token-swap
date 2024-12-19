import { ethers } from "ethers";
import CleopatraNFTContract from "@/contracts/CleopatraNecklaceNFT.json";

export const handleMetaMaskIntegration = async (tokenId: string, contractAddress: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      CleopatraNFTContract.abi,
      provider
    );

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
    throw error;
  }
};