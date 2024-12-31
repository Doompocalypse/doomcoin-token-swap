import { useNFTMetadata } from "./nft/useNFTMetadata";
import { useNFTBalances } from "./nft/useNFTBalances";
import { useNFTPurchaseHistory } from "./nft/useNFTPurchaseHistory";
import { NFT } from "@/types/nft";

export const useRealNFTData = (connectedAccount?: string) => {
  const { data: baseNfts, error: nftsError } = useNFTMetadata();
  const { data: balances } = useNFTBalances(
    connectedAccount, 
    baseNfts?.map(nft => nft.id) || []
  );
  const { data: purchasedNfts } = useNFTPurchaseHistory(connectedAccount);

  // Combine NFT data with balances
  const nfts: NFT[] | undefined = baseNfts?.map(nft => ({
    ...nft,
    balance: balances?.[nft.id] || 0
  }));

  return { nfts, purchasedNfts, nftsError };
};