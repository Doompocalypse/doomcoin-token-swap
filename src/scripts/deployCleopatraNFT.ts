import { ethers } from "ethers";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

export const deployCleopatraNFT = async (signer: ethers.Signer) => {
    // Use testnet DMC address for now
    const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    
    try {
        // First verify DMC token contract exists
        const provider = signer.provider;
        if (!provider) {
            throw new Error("No provider available");
        }

        console.log("Verifying DMC token contract...");
        const code = await provider.getCode(DOOM_COIN_ADDRESS);
        if (code === "0x") {
            throw new Error("DMC token contract not found at the specified address");
        }
        console.log("✅ DMC token contract verified");

        // Log deployment parameters
        const deployerAddress = await signer.getAddress();
        console.log("\nDeployment Parameters:");
        console.log("- DMC Token Address:", DOOM_COIN_ADDRESS);
        console.log("- Deployer Address:", deployerAddress);
        
        // Verify signer has enough balance
        const balance = await signer.getBalance();
        console.log("- Deployer Balance:", ethers.utils.formatEther(balance), "ETH");
        
        if (balance.eq(0)) {
            throw new Error("Deployer has no ETH balance");
        }

        // Create contract factory
        console.log("\nPreparing contract deployment...");
        const factory = new ethers.ContractFactory(
            CleopatraNFTContract.abi,
            CleopatraNFTContract.bytecode,
            signer
        );

        // Get network info for better error context
        const network = await provider.getNetwork();
        console.log("Deploying on network:", {
            name: network.name,
            chainId: network.chainId
        });

        // Deploy with optimized parameters
        console.log("\nDeploying contract...");
        const contract = await factory.deploy(DOOM_COIN_ADDRESS, {
            gasLimit: 3000000,
            maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
            maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei")
        });
        
        console.log("Deployment transaction sent!");
        console.log("Transaction hash:", contract.deployTransaction.hash);
        
        console.log("\nWaiting for deployment confirmation...");
        const receipt = await contract.deployTransaction.wait();
        
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
        console.log("Contract deployed to:", contract.address);
        console.log("Block number:", receipt.blockNumber);
        console.log("Gas used:", receipt.gasUsed.toString());
        console.log("Effective gas price:", ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"), "gwei");
        console.log("Total cost:", ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)), "ETH");
        
        return contract;
    } catch (error: any) {
        console.error("\nError deploying contract:", error);
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
            throw new Error("Insufficient funds to deploy contract. Please ensure you have enough ETH.");
        }
        
        if (error.code === -32000) {
            throw new Error("Gas estimation failed. Please try deploying again with the current gas settings.");
        }

        // Check if error is related to contract initialization
        if (error.message.includes("constructor")) {
            console.error("Contract initialization error. Check constructor parameters:", {
                DMCAddress: DOOM_COIN_ADDRESS
            });
        }
        
        // Check if error contains transaction details
        if (error.transaction) {
            console.error("Failed transaction details:", {
                from: error.transaction.from,
                to: error.transaction.to,
                data: error.transaction.data?.slice(0, 100) + "...", // Log first 100 chars of data
                gasLimit: error.transaction.gasLimit?.toString(),
                value: error.transaction.value?.toString()
            });
        }
        
        // Check if error contains receipt
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