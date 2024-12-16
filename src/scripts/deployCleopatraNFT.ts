import { ethers } from "ethers";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

// Constants
const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";

// Utility function to verify DMC token contract
async function verifyDMCToken(provider: ethers.providers.Provider) {
    console.log("Verifying DMC token contract...");
    const code = await provider.getCode(DOOM_COIN_ADDRESS);
    if (code === "0x") {
        throw new Error("DMC token contract not found at the specified address");
    }
    console.log("✅ DMC token contract verified");
}

// Utility function to verify deployer's balance
async function verifyDeployerBalance(signer: ethers.Signer) {
    const balance = await signer.getBalance();
    console.log("- Deployer Balance:", ethers.utils.formatEther(balance), "ETH");
    
    if (balance.eq(0)) {
        throw new Error("Deployer has no ETH balance");
    }
}

// Utility function to log deployment parameters
async function logDeploymentParams(signer: ethers.Signer) {
    const deployerAddress = await signer.getAddress();
    console.log("\nDeployment Parameters:");
    console.log("- DMC Token Address:", DOOM_COIN_ADDRESS);
    console.log("- Deployer Address:", deployerAddress);
}

// Utility function to create and deploy contract
async function createAndDeployContract(signer: ethers.Signer) {
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
        gasLimit: 3000000,
        maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei")
    });
}

// Utility function to handle deployment receipt
function handleDeploymentReceipt(receipt: ethers.ContractReceipt) {
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

// Main deployment function
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
            throw new Error("Insufficient funds to deploy contract. Please ensure you have enough ETH.");
        }
        
        if (error.code === -32000) {
            throw new Error("Gas estimation failed. Please try deploying again with the current gas settings.");
        }

        if (error.message.includes("constructor")) {
            console.error("Contract initialization error. Check constructor parameters:", {
                DMCAddress: DOOM_COIN_ADDRESS
            });
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