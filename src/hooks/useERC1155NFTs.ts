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
    price: 10,
    imageUrl: "/lovable-uploads/73296291-bbea-4f98-b1a5-6adea3033f3c.png"
  },
  2: {
    name: "COMMANDER",
    description: "A leadership tier with enhanced benefits. Commanders receive:\n• All Survivor benefits\n• Priority game testing access\n• Exclusive Commander-only events\n• Special in-game cosmetics",
    price: 10000,
    imageUrl: "/lovable-uploads/c5712e10-7ada-4e5d-ba07-7ed6caf45eda.png"
  },
  3: {
    name: "STRATEGIST",
    description: "Strategic planning tier with advanced features. Strategists gain:\n• All Commander benefits\n• Strategy development participation\n• Exclusive game mode access\n• Unique tactical advantages",
    price: 100,
    imageUrl: "/lovable-uploads/8191419d-f56c-42f6-9a49-f24545a0f96d.png"
  },
  4: {
    name: "VANGUARD",
    description: "Elite combat tier with special privileges. Vanguards unlock:\n• All Strategist benefits\n• First access to new features\n• Custom character skins\n• Special combat abilities",
    price: 1000,
    imageUrl: "/lovable-uploads/e44b3548-ea37-46f5-8dad-d5f813973c93.png"
  },
  5: {
    name: "ARCHITECT",
    description: "Master builder tier with creative powers. Architects receive:\n• All Vanguard benefits\n• World building privileges\n• Custom structure designs\n• Resource generation boost",
    price: 100000,
    imageUrl: "/lovable-uploads/08dbf822-7596-48b7-9f0f-f0ea7a4ae93b.png"
  },
  6: {
    name: "VISIONARY",
    description: "The highest tier with ultimate benefits. Visionaries gain:\n• All Architect benefits\n• Game development input\n• Exclusive NFT airdrops\n• Legendary status in-game\n• Revenue sharing opportunities",
    price: 1000000,
    imageUrl: "/lovable-uploads/891b743e-2062-4c3b-80c1-45227469d7d1.png"
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