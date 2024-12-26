import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";

const NFT_ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenByIndex(uint256 index) view returns (uint256)",
];

export const useRealNFTData = (connectedAccount?: string) => {
  const { data: contractAddress } = useQuery({
    queryKey: ['nft_contract_address'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'nft_contract_address')
        .single();
      
      if (error) throw error;
      return data.value;
    }
  });

  const { data: nfts, error: nftsError } = useQuery({
    queryKey: ['real_nfts', contractAddress],
    queryFn: async () => {
      if (!contractAddress) return [];
      
      console.log('Fetching NFTs from contract:', contractAddress);
      
      const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
      const contract = new ethers.Contract(contractAddress, NFT_ABI, provider);
      
      try {
        const totalSupply = await contract.totalSupply();
        console.log('Total NFT supply:', totalSupply);
        
        const nftData = [];
        for (let i = 0; i < totalSupply; i++) {
          const tokenId = await contract.tokenByIndex(i);
          const tokenURI = await contract.tokenURI(tokenId);
          
          // Fetch metadata from tokenURI
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          
          // Store metadata in Supabase
          await supabase.from('real_nfts').upsert({
            token_id: tokenId.toString(),
            metadata
          }, {
            onConflict: 'token_id'
          });
          
          nftData.push({
            id: tokenId.toString(),
            name: metadata.name,
            description: metadata.description,
            price: metadata.price || 0,
            image_url: metadata.image,
            video_url: metadata.animation_url || ''
          });
        }
        
        return nftData;
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
    },
    enabled: !!contractAddress
  });

  const { data: purchasedNfts } = useQuery({
    queryKey: ['real_nft_purchases', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return [];
      
      const { data, error } = await supabase
        .from('real_nft_purchases')
        .select('token_id')
        .eq('buyer_address', connectedAccount);
      
      if (error) throw error;
      return data.map(purchase => purchase.token_id);
    },
    enabled: !!connectedAccount
  });

  return { nfts, purchasedNfts, nftsError };
};