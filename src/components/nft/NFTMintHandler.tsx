import { useMintNFT } from "@/hooks/nft/useMintNFT";

export const useNFTMintHandler = (connectedAccount?: string, contractAddress?: string) => {
  return useMintNFT(connectedAccount, contractAddress);
};