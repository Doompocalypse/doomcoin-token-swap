import { useQuery } from "@tanstack/react-query";
import { useNFTContract } from "./useNFTContract";
import { ethers } from "ethers";

export const useNFTBalances = (account?: string, tokenIds: string[] = []) => {
  const contract = useNFTContract();

  return useQuery({
    queryKey: ['nft_balances', account, tokenIds],
    queryFn: async () => {
      if (!account || !contract || tokenIds.length === 0) {
        console.log("Missing requirements for balance check:", {
          account: !!account,
          contract: !!contract,
          tokenIds: tokenIds.length
        });
        return {};
      }

      console.log("Checking NFT balances for account:", account);
      console.log("Token IDs to check:", tokenIds);

      const balances: Record<string, number> = {};

      for (const tokenId of tokenIds) {
        try {
          // First check if the account owns this specific token
          const owner = await contract.ownerOf(tokenId);
          console.log(`Token ${tokenId} owner:`, owner);
          
          if (owner.toLowerCase() === account.toLowerCase()) {
            console.log(`Account ${account} owns token ${tokenId}`);
            balances[tokenId] = 1;
          } else {
            console.log(`Account ${account} does not own token ${tokenId}`);
            balances[tokenId] = 0;
          }
        } catch (error) {
          console.error(`Error checking ownership for token ${tokenId}:`, error);
          balances[tokenId] = 0;
        }
      }

      console.log("Final NFT balances:", balances);
      return balances;
    },
    enabled: !!account && !!contract && tokenIds.length > 0,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};