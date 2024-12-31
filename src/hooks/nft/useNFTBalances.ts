import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useNFTContract } from "./useNFTContract";

export const useNFTBalances = (connectedAccount?: string, tokenIds: string[] = []) => {
  const { data: contract } = useNFTContract(connectedAccount);

  return useQuery({
    queryKey: ['nft_balances', connectedAccount, tokenIds],
    queryFn: async () => {
      if (!contract || !connectedAccount) {
        console.log("No contract or connected account for balance check");
        return {};
      }

      const balances: Record<string, number> = {};
      
      for (const tokenId of tokenIds) {
        try {
          console.log(`Checking balance for token ${tokenId} and account ${connectedAccount}`);
          
          // First check if the token exists
          const exists = await contract.exists(tokenId);
          console.log(`Token ${tokenId} exists:`, exists);
          
          if (exists) {
            try {
              // Try ownerOf first
              const owner = await contract.ownerOf(tokenId);
              console.log(`Owner of token ${tokenId}:`, owner);
              
              if (owner.toLowerCase() === connectedAccount.toLowerCase()) {
                console.log(`Token ${tokenId} is owned by the connected account`);
                balances[tokenId] = 1;
              } else {
                // If not the owner, check balanceOf
                const balanceBN = await contract.balanceOf(connectedAccount, tokenId);
                balances[tokenId] = Number(balanceBN);
                console.log(`Balance for token ${tokenId}:`, balances[tokenId]);
              }
            } catch (ownerError) {
              console.log(`Error checking owner of token ${tokenId}, falling back to balanceOf:`, ownerError);
              // Fallback to balanceOf if ownerOf fails
              const balanceBN = await contract.balanceOf(connectedAccount, tokenId);
              balances[tokenId] = Number(balanceBN);
              console.log(`Fallback balance for token ${tokenId}:`, balances[tokenId]);
            }
          } else {
            console.log(`Token ${tokenId} does not exist in the contract`);
            balances[tokenId] = 0;
          }
        } catch (error) {
          console.error(`Error getting balance for token ${tokenId}:`, error);
          balances[tokenId] = 0;
        }
      }
      
      console.log("Final balances:", balances);
      return balances;
    },
    enabled: !!connectedAccount && !!contract && tokenIds.length > 0,
    refetchInterval: 30000 // Refetch every 30 seconds to keep balances updated
  });
};