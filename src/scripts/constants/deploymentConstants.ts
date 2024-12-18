import { ethers } from "ethers";

// DMC Token contract address on Sepolia (verified deployed version)
export const DOOM_COIN_ADDRESS = "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36";

// Gas configuration for NFT deployment with retry options
export const GAS_CONFIG = {
    initial: {
        gasLimit: ethers.BigNumber.from("1200000"),
        maxFeePerGas: ethers.utils.parseUnits("15", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("1.5", "gwei")
    },
    retry1: {
        gasLimit: ethers.BigNumber.from("1500000"),
        maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei")
    },
    retry2: {
        gasLimit: ethers.BigNumber.from("2000000"),
        maxFeePerGas: ethers.utils.parseUnits("25", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("2.5", "gwei")
    }
};

// Get Infura project ID from environment variables
export const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID || "";
export const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;