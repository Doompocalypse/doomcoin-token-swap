// DMC Token contract address on Sepolia (updated to latest deployed version)
export const DOOM_COIN_ADDRESS = "0x95A26A70ac69CeEEFd2aA75f0a117CF0f32e6bD4";

// Gas configuration for Sepolia with retry options
export const GAS_CONFIG = {
    initial: {
        gasLimit: 3000000, // Increased from 1,500,000
        maxFeePerGas: "20", // Increased for better chances of inclusion
        maxPriorityFeePerGas: "2" // in gwei
    },
    retry1: {
        gasLimit: 4000000,
        maxFeePerGas: "25",
        maxPriorityFeePerGas: "2.5"
    },
    retry2: {
        gasLimit: 5000000,
        maxFeePerGas: "30",
        maxPriorityFeePerGas: "3"
    }
};

// Get Infura project ID from environment
export const INFURA_PROJECT_ID = ""; // This will be replaced with the secret from Supabase
export const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;