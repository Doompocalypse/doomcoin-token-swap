import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ARBITRUM_CHAIN_ID, SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";
import { NFT_CONTRACT } from "@/services/nft/contractService";

const NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
];

export const useNFTContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (!window.ethereum) {
        console.error("Web3 provider not found");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const chainId = network.chainId.toString(16);
        console.log("Current chain ID:", chainId);

        // Validate network
        if (![ARBITRUM_CHAIN_ID.toLowerCase(), SEPOLIA_CHAIN_ID.toLowerCase()].includes(chainId.toLowerCase())) {
          console.error("Unsupported network. Please connect to Arbitrum One or Sepolia");
          return;
        }

        // Initialize contract with the current network
        const nftContract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, provider);
        console.log("NFT Contract initialized on network:", chainId);
        
        setContract(nftContract);
      } catch (error) {
        console.error("Error initializing NFT contract:", error);
      }
    };

    initializeContract();
  }, []);

  return contract;
};