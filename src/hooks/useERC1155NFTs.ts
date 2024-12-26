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
    name: "SURVIVOR",
    description: "The foundation tier of the Doom-POCalypse universe. Survivors get:\n• Early access to game testing\n• Community discord access\n• Basic in-game rewards",
    price: 100,
    imageUrl: "/lovable-uploads/487e5911-d4ae-44d8-82fb-363df9cc1eff.png"
  },
  2: {
    name: "COMMANDER",
    description: "A leadership tier with enhanced benefits. Commanders receive:\n• All Survivor benefits\n• Priority game testing access\n• Exclusive Commander-only events\n• Special in-game cosmetics",
    price: 250,
    imageUrl: "/lovable-uploads/b782cb08-ff38-49a9-a223-199ae309434f.png"
  },
  3: {
    name: "STRATEGIST", 
    description: "Strategic planning tier with advanced features. Strategists gain:\n• All Commander benefits\n• Strategy development participation\n• Exclusive game mode access\n• Unique tactical advantages",
    price: 400,
    imageUrl: "/lovable-uploads/f8c3764a-5c61-450a-8fff-4f7daf9d6b24.png"
  },
  4: {
    name: "VANGUARD",
    description: "Elite combat tier with special privileges. Vanguards unlock:\n• All Strategist benefits\n• First access to new features\n• Custom character skins\n• Special combat abilities",
    price: 600,
    imageUrl: "/lovable-uploads/6dd04cea-cba0-44b0-895a-8f621da2695f.png"
  },
  5: {
    name: "ARCHITECT",
    description: "Master builder tier with creative powers. Architects receive:\n• All Vanguard benefits\n• World building privileges\n• Custom structure designs\n• Resource generation boost",
    price: 800,
    imageUrl: "/lovable-uploads/97c7a9ea-bec9-4213-b473-ef285882518d.png"
  },
  6: {
    name: "VISIONARY",
    description: "The highest tier with ultimate benefits. Visionaries gain:\n• All Architect benefits\n• Game development input\n• Exclusive NFT airdrops\n• Legendary status in-game\n• Revenue sharing opportunities",
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