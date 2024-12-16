import { ethers } from "ethers";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

export const deployCleopatraNFT = async (signer: ethers.Signer) => {
    console.log("Starting deployment of Cleopatra's Necklace NFT contract...");
    
    // Use testnet DMC address for now
    const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    
    try {
        // Verify DMC token contract exists
        const provider = signer.provider;
        if (!provider) {
            throw new Error("No provider available");
        }

        console.log("Verifying DMC token contract...");
        const code = await provider.getCode(DOOM_COIN_ADDRESS);
        if (code === "0x") {
            throw new Error("DMC token contract not found at the specified address");
        }

        // Log deployment parameters
        const deployerAddress = await signer.getAddress();
        console.log("Deployment Parameters:");
        console.log("- DMC Token Address:", DOOM_COIN_ADDRESS);
        console.log("- Deployer Address:", deployerAddress);
        
        // Verify signer has enough balance
        const balance = await signer.getBalance();
        console.log("- Deployer Balance:", ethers.utils.formatEther(balance), "ETH");
        
        if (balance.eq(0)) {
            throw new Error("Deployer has no ETH balance");
        }

        // Get current gas price
        const gasPrice = await provider.getGasPrice();
        console.log("Current gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

        // Create contract factory
        console.log("\nCreating contract factory...");
        const factory = new ethers.ContractFactory(
            CleopatraNFTContract.abi,
            CleopatraNFTContract.bytecode,
            signer
        );
        
        // Deploy with lower gas parameters
        console.log("Deploying contract...");
        const contract = await factory.deploy(DOOM_COIN_ADDRESS, {
            gasLimit: 1500000, // Lower gas limit
            maxFeePerGas: ethers.utils.parseUnits("20", "gwei"), // Lower max fee
            maxPriorityFeePerGas: ethers.utils.parseUnits("1.5", "gwei") // Lower priority fee
        });
        
        console.log("Waiting for deployment transaction...");
        console.log("Transaction hash:", contract.deployTransaction.hash);
        
        const receipt = await contract.deployTransaction.wait();
        
        if (receipt.status === 0) {
            console.error("Transaction details:", {
                gasUsed: receipt.gasUsed.toString(),
                effectiveGasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"),
                blockNumber: receipt.blockNumber,
            });
            throw new Error("Contract deployment failed - transaction reverted");
        }
        
        console.log("\nDeployment successful!");
        console.log("Contract deployed to:", contract.address);
        console.log("Transaction hash:", receipt.transactionHash);
        console.log("Gas used:", receipt.gasUsed.toString());
        console.log("Effective gas price:", ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"), "gwei");
        console.log("Total cost:", ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)), "ETH");
        
        return contract;
    } catch (error: any) {
        console.error("\nError deploying contract:", error.message);
        
        // Enhanced error reporting
        if (error.code === 'INSUFFICIENT_FUNDS') {
            throw new Error("Insufficient funds to deploy contract. Please ensure you have enough ETH.");
        }
        
        if (error.code === -32000) {
            throw new Error("Gas estimation failed. Please try again with a different gas limit.");
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