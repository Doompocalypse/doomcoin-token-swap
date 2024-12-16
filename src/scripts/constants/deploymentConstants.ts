// DMC Token contract address on Sepolia (updated to latest deployed version)
export const DOOM_COIN_ADDRESS = "0x7F67a7ec5bde1Fa506efDE61F0Fb9650672d2d27";

// Gas configuration for Sepolia with retry options
export const GAS_CONFIG = {
    initial: {
        gasLimit: 3000000,
        maxFeePerGas: "20",
        maxPriorityFeePerGas: "2"
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