import { ethers } from "ethers";
import { initializeAlchemy, fetchContractTemplate } from "./utils/alchemyUtils";
import { validateNetwork, validateBalance } from "./utils/networkValidation";
import { deployContract, verifyDeployment } from "./utils/contractDeployment";

export const deployDMCToken = async (signer: ethers.Signer) => {
    try {
        console.log("Starting DMC token deployment process...");
        
        // Initialize Alchemy and validate network/balance
        const alchemy = await initializeAlchemy();
        await validateNetwork(signer);
        await validateBalance(signer);
        
        // Get contract template and deploy
        const template = await fetchContractTemplate(alchemy);
        const contract = await deployContract(signer, template.bytecode);
        
        // Verify deployment
        await verifyDeployment(contract, signer);
        return contract;
        
    } catch (error: any) {
        console.error("Deployment error details:", error);
        
        // Enhanced error messages for common issues
        if (error.code === "INSUFFICIENT_FUNDS") {
            throw new Error("Not enough ETH to deploy contract. Please ensure you have sufficient Sepolia ETH.");
        }
        
        if (error.code === "NETWORK_ERROR") {
            throw new Error("Network connection issue. Please check your internet connection and wallet connection.");
        }
        
        if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
            throw new Error("Gas estimation failed. The contract might be invalid or the network might be congested.");
        }
        
        // Include transaction details in error if available
        if (error.transaction) {
            console.error("Failed transaction details:", {
                from: error.transaction.from,
                to: error.transaction.to,
                gasLimit: error.transaction.gasLimit?.toString(),
                value: error.transaction.value?.toString()
            });
        }
        
        throw error;
    }
};