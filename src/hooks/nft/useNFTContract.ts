import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";
import { ARBITRUM_CHAIN_ID, SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";

const NFT_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function exists(uint256 id) view returns (bool)",
  "function uri(uint256 id) view returns (string)",
  "function totalSupply(uint256 id) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

export const useNFTContract = (connectedAccount?: string) => {
  return useQuery({
    queryKey: ['nft_contract', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return null;

      // Get NFT contract address from app_settings
      const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'nft_contract_address')
        .single();
      
      if (settingsError || !settings) {
        console.error('Error fetching NFT contract address:', settingsError);
        throw new Error('NFT contract address not found');
      }

      const contractAddress = settings.value;
      console.log('NFT Contract Address:', contractAddress);

      // Get the current chain ID from MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);
      console.log('Current chain ID:', chainId);

      // Use appropriate RPC URL based on network
      let rpcUrl;
      if (chainId.toLowerCase() === ARBITRUM_CHAIN_ID.toLowerCase()) {
        console.log('Using Arbitrum RPC URL');
        rpcUrl = "https://arb1.arbitrum.io/rpc";
      } else if (chainId.toLowerCase() === SEPOLIA_CHAIN_ID.toLowerCase()) {
        console.log('Using Sepolia RPC URL');
        rpcUrl = "https://rpc.sepolia.org";
      } else {
        throw new Error('Unsupported network');
      }

      // Initialize provider with correct RPC URL
      const networkProvider = new ethers.JsonRpcProvider(rpcUrl);
      console.log('Initialized provider with RPC URL:', rpcUrl);

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, NFT_ABI, networkProvider);
      console.log('Contract initialized successfully');

      return contract;
    },
    enabled: !!connectedAccount,
    staleTime: 30000 // Consider data fresh for 30 seconds
  });
};