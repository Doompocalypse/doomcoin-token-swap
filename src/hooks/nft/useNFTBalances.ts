import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useNFTContract } from "./useNFTContract";

export const useNFTBalances = (connectedAccount?: string, tokenIds: string[] = []) => {
  const { data: contract } = useNFTContract(connectedAccount);

  return useQuery({
    queryKey: ['nft_balances', connectedAccount, tokenIds],
    queryFn: async () => {
      if (!contract || !connectedAccount) return {};

      const balances: Record<string, number> = {};
      
      for (const tokenId of tokenIds) {
        try {
          console.log(`Checking balance for token ${tokenId} and account ${connectedAccount}`);
          const exists = await contract.exists(tokenId);
          
          if (exists) {
            const balanceBN = await contract.balanceOf(connectedAccount, tokenId);
            balances[tokenId] = Number(balanceBN);
            console.log(`Balance for token ${tokenId}:`, balances[tokenId]);
          } else {
            console.log(`Token ${tokenId} does not exist in the contract`);
            balances[tokenId] = 0;
          }
        } catch (error) {
          console.error(`Error getting balance for token ${tokenId}:`, error);
          balances[tokenId] = 0;
        }
      }
      
      return balances;
    },
    enabled: !!connectedAccount && !!contract && tokenIds.length > 0,
    refetchInterval: 30000 // Refetch every 30 seconds to keep balances updated
  });
};