// DMC Token contract address on Sepolia (updated to latest deployed version)
export const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

// Gas configuration for Sepolia with retry options
export const GAS_CONFIG = {
    initial: {
        gasLimit: 1200000, // Reduced from 3000000
        maxFeePerGas: "15",  // Reduced from 20
        maxPriorityFeePerGas: "1.5" // Reduced from 2
    },
    retry1: {
        gasLimit: 1500000, // Reduced from 4000000
        maxFeePerGas: "20", // Reduced from 25
        maxPriorityFeePerGas: "2" // Reduced from 2.5
    },
    retry2: {
        gasLimit: 2000000, // Reduced from 5000000
        maxFeePerGas: "25", // Reduced from 30
        maxPriorityFeePerGas: "2.5" // Reduced from 3
    }
};

// Get Infura project ID from environment
export const INFURA_PROJECT_ID = ""; // This will be replaced with the secret from Supabase
export const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;