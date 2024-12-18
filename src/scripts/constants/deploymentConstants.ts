import { ethers } from "ethers";

// DMC Token contract address on Sepolia (verified deployed version)
export const DOOM_COIN_ADDRESS = "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36";

// Gas configuration for NFT deployment with retry options
export const GAS_CONFIG = {
    initial: {
        gasLimit: ethers.BigNumber.from("1200000"),
        maxFeePerGas: "15",
        maxPriorityFeePerGas: "1.5"
    },
    retry1: {
        gasLimit: ethers.BigNumber.from("1500000"),
        maxFeePerGas: "20",
        maxPriorityFeePerGas: "2"
    },
    retry2: {
        gasLimit: ethers.BigNumber.from("2000000"),
        maxFeePerGas: "25",
        maxPriorityFeePerGas: "2.5"
    }
};

// Get Infura project ID from environment
export const INFURA_PROJECT_ID = ""; // This will be replaced with the secret from Supabase
export const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;