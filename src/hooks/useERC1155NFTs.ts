import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xE4e4EBe798D29Cc75e674B58B3B6Da00227A9839";
const CONTRACT_ABI = [
  "function SURVIVOR() view returns (uint256)",
  "function COMMANDER() view returns (uint256)",
  "function STRATEGIST() view returns (uint256)",
  "function VANGUARD() view returns (uint256)",
  "function ARCHITECT() view returns (uint256)",
  "function VISIONARY() view returns (uint256)",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function uri(uint256 id) view returns (string)"
];

const NFT_METADATA = {
  1: {
    name: "Survivor Tier",
    description: "The foundation of our community, Survivors are the brave souls who've chosen to face the challenges of the post-apocalyptic world.",
    price: 100,
    imageUrl: "/lovable-uploads/d89c3541-c973-4fc0-9fe9-7adf6ad0a40c.png"
  },
  2: {
    name: "Commander Tier",
    description: "Leaders who guide our forces through the wasteland, Commanders are tactical experts in survival and resource management.",
    price: 250,
    imageUrl: "/lovable-uploads/b782cb08-ff38-49a9-a223-199ae309434f.png"
  },
  3: {
    name: "Strategist Tier",
    description: "Elite planners who analyze patterns and devise long-term survival strategies for our community.",
    price: 400,
    imageUrl: "/lovable-uploads/f8c3764a-5c61-450a-8fff-4f7daf9d6b24.png"
  },
  4: {
    name: "Vanguard Tier",
    description: "Elite protectors of our community, Vanguards are the first line of defense against wasteland threats.",
    price: 600,
    imageUrl: "/lovable-uploads/6dd04cea-cba0-44b0-895a-8f621da2695f.png"
  },
  5: {
    name: "Architect Tier",
    description: "Masters of reconstruction, Architects design and build the foundations of our new civilization.",
    price: 800,
    imageUrl: "/lovable-uploads/97c7a9ea-bec9-4213-b473-ef285882518d.png"
  },
  6: {
    name: "Visionary Tier",
    description: "The most prestigious rank, Visionaries shape the future of our post-apocalyptic society.",
    price: 1000,
    imageUrl: "/lovable-uploads/0c37c47b-cfd2-4cc0-9cbe-c285a6d4ff34.png"
  }
};

export const useERC1155NFTs = (connectedAccount?: string) => {
  return useQuery({
    queryKey: ['erc1155-nfts', connectedAccount, CONTRACT_ADDRESS],
    queryFn: async () => {
      console.log('Fetching ERC1155 NFTs for account:', connectedAccount);
      
      const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Get all token IDs (1-6 for our NFTs)
      const tokenIds = [1, 2, 3, 4, 5, 6];
      
      const nftsWithBalances = await Promise.all(
        tokenIds.map(async (id) => {
          try {
            const balance = connectedAccount ? 
              await contract.balanceOf(connectedAccount, id) : 
              BigInt(0);
            
            const metadata = NFT_METADATA[id as keyof typeof NFT_METADATA];
            
            return {
              id: id.toString(),
              balance: Number(balance),
              ...metadata,
              videoUrl: "", // Add video URL if available
            };
          } catch (error) {
            console.error(`Error fetching balance for token ${id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any failed fetches
      return nftsWithBalances.filter((nft): nft is NonNullable<typeof nft> => nft !== null);
    },
    enabled: true // Always fetch NFTs, even without connected account
  });
};