// DMC Token contract address on Arbitrum
export const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

// Gas configuration for Arbitrum with retry options
export const GAS_CONFIG = {
    initial: {
        gasLimit: 3000000,
        maxFeePerGas: "50", // in gwei
        maxPriorityFeePerGas: "2" // in gwei
    },
    retry1: {
        gasLimit: 4000000,
        maxFeePerGas: "75",
        maxPriorityFeePerGas: "3"
    },
    retry2: {
        gasLimit: 5000000,
        maxFeePerGas: "100",
        maxPriorityFeePerGas: "4"
    }
};

export const ARBITRUM_RPC_URL = "https://arb1.arbitrum.io/rpc";