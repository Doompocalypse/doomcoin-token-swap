import { ethers } from "ethers";
import { DOOM_COIN_ADDRESS, GAS_CONFIG } from "../constants/deploymentConstants";
import CleopatraNFTContract from "../../contracts/CleopatraNecklaceNFT.json";

async function attemptDeploy(factory: ethers.ContractFactory, config: any) {
    console.log("\nAttempting deployment with gas config:", {
        gasLimit: config.gasLimit,
        maxFeePerGas: config.maxFeePerGas,
        maxPriorityFeePerGas: config.maxPriorityFeePerGas
    });

    return factory.deploy(DOOM_COIN_ADDRESS, {
        gasLimit: config.gasLimit,
        maxFeePerGas: ethers.utils.parseUnits(config.maxFeePerGas, "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits(config.maxPriorityFeePerGas, "gwei")
    });
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
        console.log("Initial deployment failed, trying with higher gas (retry 1)...");
        try {
            return await attemptDeploy(factory, GAS_CONFIG.retry1);
        } catch (error: any) {
            console.log("Retry 1 failed, attempting final retry with maximum gas...");
            return await attemptDeploy(factory, GAS_CONFIG.retry2);
        }
    }
}

export function handleDeploymentReceipt(receipt: ethers.ContractReceipt) {
    if (receipt.status === 0) {
        console.error("\nDeployment Failed! Transaction details:", {
            gasUsed: receipt.gasUsed.toString(),
            effectiveGasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"),
            blockNumber: receipt.blockNumber,
            transactionHash: receipt.transactionHash
        });

        // Check for specific failure conditions
        if (receipt.gasUsed.eq(receipt.gasLimit)) {
            throw new Error("Contract deployment failed - Out of gas. Try increasing gas limit.");
        }
        throw new Error("Contract deployment failed - transaction reverted");
    }

    console.log("\nDeployment successful!");
    console.log("Block number:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Effective gas price:", ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"), "gwei");
    console.log("Total cost:", ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)), "ETH");
}