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
            // Get balance using balanceOf
            const balanceBN = await contract.balanceOf(connectedAccount, tokenId);
            balances[tokenId] = Number(balanceBN);
            console.log(`Balance for token ${tokenId}:`, balances[tokenId]);

            // Double check ownership using ownerOf as backup
            try {
              const owner = await contract.ownerOf(tokenId);
              console.log(`Owner of token ${tokenId}:`, owner);
              
              // If ownerOf returns the connected account, ensure balance is at least 1
              if (owner.toLowerCase() === connectedAccount.toLowerCase() && balances[tokenId] === 0) {
                console.log(`Setting minimum balance of 1 for owned token ${tokenId}`);
                balances[tokenId] = 1;
              }
            } catch (ownerError) {
              console.log(`Error checking owner of token ${tokenId}:`, ownerError);
              // If ownerOf fails, trust the balanceOf result
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