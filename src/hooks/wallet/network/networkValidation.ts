import { SEPOLIA_CHAIN_ID } from "./networkConfig";

export const validateCurrentNetwork = async (provider: any) => {
  const currentChainId = await provider.request({
    method: 'eth_chainId'
  });
  
  console.log("Current chain ID:", currentChainId);
  console.log("Target Sepolia chain ID:", SEPOLIA_CHAIN_ID);

  return {
    currentChainId,
    isCorrectNetwork: currentChainId.toLowerCase() === SEPOLIA_CHAIN_ID.toLowerCase()
  };
};