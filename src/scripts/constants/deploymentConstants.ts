// DMC Token contract address on Sepolia
export const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

// Gas configuration for Sepolia with retry options
export const GAS_CONFIG = {
    initial: {
        gasLimit: 3000000,
        maxFeePerGas: "20", // in gwei
        maxPriorityFeePerGas: "1.5" // in gwei
    },
    retry1: {
        gasLimit: 4000000,
        maxFeePerGas: "25",
        maxPriorityFeePerGas: "2"
    },
    retry2: {
        gasLimit: 5000000,
        maxFeePerGas: "30",
        maxPriorityFeePerGas: "2.5"
    }
};

export const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/";