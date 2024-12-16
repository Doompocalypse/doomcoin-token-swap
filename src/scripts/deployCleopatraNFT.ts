import { ethers } from "ethers";
import { verifyDMCToken, verifyDeployerBalance, logDeploymentParams } from "./utils/contractVerification";
import { createAndDeployContract, handleDeploymentReceipt } from "./utils/deploymentHandler";

export const deployCleopatraNFT = async (signer: ethers.Signer) => {
    try {
        const provider = signer.provider;
        if (!provider) {
            throw new Error("No provider available");
        }

        await verifyDMCToken(provider);
        await verifyDeployerBalance(signer);
        await logDeploymentParams(signer);

        const contract = await createAndDeployContract(signer);
        console.log("Transaction hash:", contract.deployTransaction.hash);
        
        console.log("\nWaiting for deployment confirmation...");
        const receipt = await contract.deployTransaction.wait();
        
        handleDeploymentReceipt(receipt);
        console.log("Contract deployed to:", contract.address);
        
        return contract;
    } catch (error: any) {
        console.error("\nError deploying contract:", error);
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
            throw new Error("Insufficient DMC tokens to deploy contract");
        }
        
        if (error.code === -32000) {
            throw new Error("Gas estimation failed. Please try deploying again.");
        }

        if (error.message.includes("constructor")) {
            console.error("Contract initialization error. Check constructor parameters.");
        }
        
        if (error.transaction) {
            console.error("Failed transaction details:", {
                from: error.transaction.from,
                to: error.transaction.to,
                data: error.transaction.data?.slice(0, 100) + "...",
                gasLimit: error.transaction.gasLimit?.toString(),
                value: error.transaction.value?.toString()
            });
        }
        
        if (error.receipt) {
            console.error("Transaction receipt:", {
                status: error.receipt.status,
                gasUsed: error.receipt.gasUsed?.toString(),
                blockNumber: error.receipt.blockNumber,
                transactionHash: error.receipt.transactionHash
            });
        }
        
        throw new Error(`Contract deployment failed: ${error.message}`);
    }
};