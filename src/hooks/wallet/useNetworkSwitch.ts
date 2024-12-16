import { SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";

export const useNetworkSwitch = () => {
  const switchToSepolia = async (provider: any) => {
    const currentChainId = await provider.request({
      method: 'eth_chainId'
    });
    
    if (currentChainId.toLowerCase() !== SEPOLIA_CHAIN_ID.toLowerCase()) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        console.error("Network switch error:", switchError);
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.infura.io/rpc'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }]
          });
        } else {
          throw switchError;
        }
      }
    }
  };

  return { switchToSepolia };
};