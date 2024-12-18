import { ethers } from "ethers";
import { GAS_CONFIG } from "../constants/deploymentConstants";
import CleopatraNFTContract from "../../contracts/CleopatraNecklaceNFT.json";

async function attemptDeploy(factory: ethers.ContractFactory, config: any) {
    console.log("\nAttempting deployment with gas config:", {
        gasLimit: config.gasLimit.toString(),
        maxFeePerGas: ethers.utils.formatUnits(config.maxFeePerGas, "gwei"),
        maxPriorityFeePerGas: ethers.utils.formatUnits(config.maxPriorityFeePerGas, "gwei")
    });

    try {
        return await factory.deploy({
            gasLimit: config.gasLimit,
            maxFeePerGas: config.maxFeePerGas,
            maxPriorityFeePerGas: config.maxPriorityFeePerGas
        });
    } catch (error: any) {
        console.error("Deployment attempt failed:", error.message);
        if (error.message.includes("insufficient funds")) {
            throw new Error("Insufficient funds for deployment. Please make sure you have enough ETH.");
        }
        throw error;
    }
}

export async function createAndDeployContract(signer: ethers.Signer) {
    const factory = new ethers.ContractFactory(
        CleopatraNFTContract.abi,
        CleopatraNFTContract.bytecode,
        signer
    );

    const network = await signer.provider?.getNetwork();
    console.log("Deploying on network:", {
        name: network?.name,
        chainId: network?.chainId
    });

    // Try deployment with increasing gas configurations
    try {
        console.log("\nTrying initial deployment...");
        return await attemptDeploy(factory, GAS_CONFIG.initial);
    } catch (error: any) {
        console.log("Initial deployment failed:", error.message);
        console.log("Trying with higher gas (retry 1)...");
        try {
            return await attemptDeploy(factory, GAS_CONFIG.retry1);
        } catch (error: any) {
            console.log("Retry 1 failed:", error.message);
            console.log("Attempting final retry with maximum gas...");
            return await attemptDeploy(factory, GAS_CONFIG.retry2);
        }
    }
}

export function handleDeploymentReceipt(receipt: ethers.ContractReceipt) {
    console.log("\nTransaction receipt received:", {
        status: receipt.status,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber,
        transactionHash: receipt.transactionHash
    });

    if (receipt.status === 0) {
        console.error("\nDeployment Failed! Transaction details:", {
            gasUsed: receipt.gasUsed.toString(),
            effectiveGasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"),
            blockNumber: receipt.blockNumber,
            transactionHash: receipt.transactionHash
        });

        if (receipt.gasUsed.eq(receipt.cumulativeGasUsed)) {
            throw new Error("Contract deployment failed - Out of gas. Try increasing gas limit.");
        }
        throw new Error("Contract deployment failed - transaction reverted. Check the deployment parameters.");
    }

    console.log("\nDeployment successful!");
    console.log("Block number:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Effective gas price:", ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"), "gwei");
    console.log("Total cost:", ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)), "ETH");
}