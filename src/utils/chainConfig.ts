import { SupportedChains } from "@/types/wallet";

export const ARBITRUM_CHAIN_ID = "0xa4b1"; // Arbitrum One Chain ID

export const SUPPORTED_CHAINS: SupportedChains = {
  "0x1": {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io/"],
  },
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
};

export const switchToArbitrum = async () => {
  // Remove this function's implementation since we don't want to force network switching
  return true;
};