import { ethers } from "ethers";
import { DOOM_COIN_ADDRESS, GAS_CONFIG } from "../constants/deploymentConstants";
import CleopatraNFTContract from "../../contracts/CleopatraNecklaceNFT.json";

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

    console.log("\nDeploying contract...");
    return factory.deploy(DOOM_COIN_ADDRESS, {
        gasLimit: GAS_CONFIG.gasLimit,
        maxFeePerGas: ethers.utils.parseUnits(GAS_CONFIG.maxFeePerGas, "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits(GAS_CONFIG.maxPriorityFeePerGas, "gwei")
    });
}

export function handleDeploymentReceipt(receipt: ethers.ContractReceipt) {
    if (receipt.status === 0) {
        console.error("\nDeployment Failed! Transaction details:", {
            gasUsed: receipt.gasUsed.toString(),
            effectiveGasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"),
            blockNumber: receipt.blockNumber,
            transactionHash: receipt.transactionHash
        });
        throw new Error("Contract deployment failed - transaction reverted");
    }

    console.log("\nDeployment successful!");
    console.log("Block number:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Effective gas price:", ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"), "gwei");
    console.log("Total cost:", ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)), "ETH");
}