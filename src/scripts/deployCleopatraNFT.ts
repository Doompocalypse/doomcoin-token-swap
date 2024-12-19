import { ethers } from "ethers";
import { verifyDeployerBalance, logDeploymentParams } from "./utils/contractVerification";
import { createAndDeployContract, handleDeploymentReceipt } from "./utils/deploymentHandler";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

export const deployCleopatraNFT = async (signer: ethers.Signer) => {
    try {
        const provider = signer.provider;
        if (!provider) {
            throw new Error("No provider available");
        }

        console.log("Starting NFT deployment...");

        await verifyDeployerBalance(signer);
        await logDeploymentParams(signer);

        // Create contract factory with the updated ABI
        const factory = new ethers.ContractFactory(
            CleopatraNFTContract.abi,
            CleopatraNFTContract.bytecode,
            signer
        );

        console.log("Deploying contract with updated ABI...");
        const contract = await factory.deploy();
        console.log("Transaction hash:", contract.deployTransaction.hash);
        
        console.log("\nWaiting for deployment confirmation...");
        const receipt = await contract.deployTransaction.wait();
        
        handleDeploymentReceipt(receipt);
        console.log("Contract deployed to:", contract.address);
        
        // Verify the contract works by calling basic functions
        const name = await contract.name();
        const symbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();
        
        console.log("Contract verification:", {
            name,
            symbol,
            totalSupply: totalSupply.toString()
        });
        
        return contract;
    } catch (error: any) {
        console.error("\nError deploying contract:", error);
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
            throw new Error("Insufficient ETH to deploy contract");
        }
        
        if (error.code === -32000) {
            throw new Error("Gas estimation failed. Please try deploying again.");
        }

        if (error.message.includes("constructor")) {
            console.error("Contract initialization error. Check constructor parameters.");
        }
        
        throw new Error(`Contract deployment failed: ${error.message}`);
    }
};