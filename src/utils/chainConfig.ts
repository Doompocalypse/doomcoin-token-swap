import { SupportedChains } from "@/types/wallet";

export const ARBITRUM_CHAIN_ID = "0xa4b1"; // Arbitrum One Chain ID
export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia Testnet Chain ID

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

export const switchToNetwork = async (targetChainId: string) => {
  if (!window.ethereum) return false;
  
  try {
    console.log(`Attempting to switch to chain: ${targetChainId}`);
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SUPPORTED_CHAINS[targetChainId]],
        });
        return true;
      } catch (addError) {
        console.error('Error adding chain:', addError);
        return false;
      }
    }
    console.error('Error switching chain:', switchError);
    return false;
  }
};