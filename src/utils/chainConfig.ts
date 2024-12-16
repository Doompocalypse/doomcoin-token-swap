import { SupportedChains } from "@/types/wallet";

export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia Chain ID

// Get Infura project ID from environment
const INFURA_PROJECT_ID = "0d63e4b93b8abc2ea0a58328d7e7c053";

export const SUPPORTED_CHAINS: SupportedChains = {
  "0xaa36a7": {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
  },
};

export const switchToSepolia = async () => {
  if (!window.ethereum) return false;
  
  try {
    console.log("Attempting to switch to Sepolia network...");
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
    console.log("Successfully switched to Sepolia");
    return true;
  } catch (switchError: any) {
    console.log("Error switching to Sepolia:", switchError);
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        console.log("Adding Sepolia network to wallet...");
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SUPPORTED_CHAINS[SEPOLIA_CHAIN_ID]],
        });
        console.log("Successfully added Sepolia network");
        return true;
      } catch (addError) {
        console.error('Error adding Sepolia chain:', addError);
        return false;
      }
    }
    console.error('Error switching to Sepolia chain:', switchError);
    return false;
  }
};