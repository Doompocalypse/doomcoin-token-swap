import { SupportedChains } from "@/types/wallet";

export const ARBITRUM_CHAIN_ID = "0xa4b1"; // Arbitrum One Chain ID
export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia Chain ID

export const SUPPORTED_CHAINS: SupportedChains = {
  "0xa4b1": {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
  },
  "0xaa36a7": {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.infura.io/v3/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};

export const isSupportedChain = (chainId: string): boolean => {
  const normalizedChainId = chainId.toLowerCase();
  return [ARBITRUM_CHAIN_ID.toLowerCase(), SEPOLIA_CHAIN_ID.toLowerCase()].includes(normalizedChainId);
};

export const getNetworkName = (chainId: string): string => {
  const normalizedChainId = chainId.toLowerCase();
  
  if (normalizedChainId === ARBITRUM_CHAIN_ID.toLowerCase()) {
    return "Arbitrum";
  }
  if (normalizedChainId === SEPOLIA_CHAIN_ID.toLowerCase()) {
    return "Sepolia";
  }
  return "Unsupported Network";
};