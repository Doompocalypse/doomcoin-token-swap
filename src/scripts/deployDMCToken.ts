import { ethers } from "ethers";
import { validateNetwork, validateBalance } from "./utils/networkValidation";
import { deployContract, verifyDeployment } from "./utils/contractDeployment";

export const deployDMCToken = async (signer: ethers.Signer) => {
    try {
        console.log("Starting DMC token deployment process...");
        
        // Validate network and balance first
        await validateNetwork(signer);
        await validateBalance(signer);
        
        // Deploy contract directly without Alchemy
        console.log("Deploying contract...");
        const contract = await deployContract(signer);
        
        // Verify deployment
        await verifyDeployment(contract, signer);
        return contract;
        
    } catch (error: any) {
        console.error("Deployment error details:", error);
        
        if (error.code === "INSUFFICIENT_FUNDS") {
            throw new Error("Not enough ETH to deploy contract. Please ensure you have sufficient Sepolia ETH.");
        }
        
        if (error.code === "NETWORK_ERROR") {
            throw new Error("Network connection issue. Please check your internet connection and wallet connection.");
        }
        
        if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
            throw new Error("Gas estimation failed. The contract might be invalid or the network might be congested.");
        }
        
        throw error;
    }
};