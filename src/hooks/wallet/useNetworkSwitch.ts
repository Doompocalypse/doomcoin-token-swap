import { ARBITRUM_CHAIN_ID } from "@/utils/chainConfig";

export const useNetworkSwitch = () => {
  const switchToArbitrum = async (provider: any) => {
    const currentChainId = await provider.request({
      method: 'eth_chainId'
    });
    
    if (currentChainId.toLowerCase() !== ARBITRUM_CHAIN_ID.toLowerCase()) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ARBITRUM_CHAIN_ID }],
        });
      } catch (switchError: any) {
        console.error("Network switch error:", switchError);
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: ARBITRUM_CHAIN_ID,
              chainName: 'Arbitrum One',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://arbiscan.io/']
            }]
          });
        } else {
          throw switchError;
        }
      }
    }
  };

  return { switchToArbitrum };
};