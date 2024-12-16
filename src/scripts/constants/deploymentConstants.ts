// DMC Token contract address on Sepolia
export const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

// Gas configuration for Sepolia with retry options
export const GAS_CONFIG = {
    initial: {
        gasLimit: 1500000, // Reduced from 3,000,000
        maxFeePerGas: "15", // Reduced from 20 gwei
        maxPriorityFeePerGas: "1.5" // in gwei
    },
    retry1: {
        gasLimit: 2000000,
        maxFeePerGas: "20",
        maxPriorityFeePerGas: "2"
    },
    retry2: {
        gasLimit: 2500000,
        maxFeePerGas: "25",
        maxPriorityFeePerGas: "2.5"
    }
};

// Get Infura project ID from environment
export const INFURA_PROJECT_ID = ""; // This will be replaced with the secret from Supabase
export const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;