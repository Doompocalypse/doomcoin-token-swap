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
    price: 0.0069,
    imageUrl: "https://i.seadn.io/gcs/files/8f7d86c8e9f8c0c0f7f9f8c0c0f7f9f8.png?auto=format&dpr=1&w=1000"
  },
  2: {
    name: "COMMANDER",
    description: "A leadership tier with enhanced benefits. Commanders receive:\n• All Survivor benefits\n• Priority game testing access\n• Exclusive Commander-only events\n• Special in-game cosmetics",
    price: 0.0169,
    imageUrl: "https://i.seadn.io/gcs/files/9f7d86c8e9f8c0c0f7f9f8c0c0f7f9f8.png?auto=format&dpr=1&w=1000"
  },
  3: {
    name: "STRATEGIST",
    description: "Strategic planning tier with advanced features. Strategists gain:\n• All Commander benefits\n• Strategy development participation\n• Exclusive game mode access\n• Unique tactical advantages",
    price: 0.0269,
    imageUrl: "https://i.seadn.io/gcs/files/7f7d86c8e9f8c0c0f7f9f8c0c0f7f9f8.png?auto=format&dpr=1&w=1000"
  },
  4: {
    name: "VANGUARD",
    description: "Elite combat tier with special privileges. Vanguards unlock:\n• All Strategist benefits\n• First access to new features\n• Custom character skins\n• Special combat abilities",
    price: 0.0369,
    imageUrl: "https://i.seadn.io/gcs/files/6f7d86c8e9f8c0c0f7f9f8c0c0f7f9f8.png?auto=format&dpr=1&w=1000"
  },
  5: {
    name: "ARCHITECT",
    description: "Master builder tier with creative powers. Architects receive:\n• All Vanguard benefits\n• World building privileges\n• Custom structure designs\n• Resource generation boost",
    price: 0.0469,
    imageUrl: "https://i.seadn.io/gcs/files/5f7d86c8e9f8c0c0f7f9f8c0c0f7f9f8.png?auto=format&dpr=1&w=1000"
  },
  6: {
    name: "VISIONARY",
    description: "The highest tier with ultimate benefits. Visionaries gain:\n• All Architect benefits\n• Game development input\n• Exclusive NFT airdrops\n• Legendary status in-game\n• Revenue sharing opportunities",
    price: 0.0569,
    imageUrl: "https://i.seadn.io/gcs/files/4f7d86c8e9f8c0c0f7f9f8c0c0f7f9f8.png?auto=format&dpr=1&w=1000"
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
