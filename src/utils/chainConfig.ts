import { SupportedChains } from "@/types/wallet";

export const ARBITRUM_CHAIN_ID = "0xa4b1"; // Arbitrum One Chain ID

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
};

export const switchToArbitrum = async () => {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARBITRUM_CHAIN_ID }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SUPPORTED_CHAINS[ARBITRUM_CHAIN_ID]],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Arbitrum network:', addError);
        return false;
      }
    }
    console.error('Error switching to Arbitrum:', switchError);
    return false;
  }
};