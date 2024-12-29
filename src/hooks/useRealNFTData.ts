import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";
import { NFT, NFTMetadata } from "@/types/nft";

const NFT_ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenByIndex(uint256 index) view returns (uint256)",
];

export const useRealNFTData = (connectedAccount?: string) => {
  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['real_nfts', connectedAccount],
    queryFn: async () => {
      const { data: contractAddress } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'nft_contract_address')
        .single();
      
      if (!contractAddress) {
        throw new Error('NFT contract address not found');
      }
      
      console.log('Fetching NFTs from contract:', contractAddress.value);
      
      const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
      const contract = new ethers.Contract(contractAddress.value, NFT_ABI, provider);
      
      try {
        const totalSupply = await contract.totalSupply();
        console.log('Total NFT supply:', totalSupply);
        
        const nftData: NFT[] = [];
        for (let i = 0; i < totalSupply; i++) {
          const tokenId = await contract.tokenByIndex(i);
          const tokenURI = await contract.tokenURI(tokenId);
          
          // Fetch metadata from tokenURI
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          
          // Store metadata in Supabase
          await supabase.from('nft_metadata').upsert({
            token_id: tokenId.toString(),
            name: metadata.name,
            description: metadata.description,
            image_url: metadata.image,
            attributes: metadata.attributes
          } as NFTMetadata, {
            onConflict: 'token_id'
          });
          
          nftData.push({
            id: tokenId.toString(),
            name: metadata.name,
            description: metadata.description,
            price: metadata.price || 0,
            imageUrl: metadata.image,
            videoUrl: metadata.animation_url || ''
          });
        }
        
        return nftData;
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
    }
  });

  const { data: purchasedNfts } = useQuery({
    queryKey: ['nft_purchases', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return [];
      
      const { data, error } = await supabase
        .from('nft_purchases')
        .select('token_id')
        .eq('buyer_address', connectedAccount);
      
      if (error) throw error;
      return data.map(purchase => purchase.token_id);
    },
    enabled: !!connectedAccount
  });

  return { nfts, purchasedNfts, nftsError };
};