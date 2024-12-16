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

        // Create contract factory
        console.log("\nPreparing contract deployment...");
        const factory = new ethers.ContractFactory(
            CleopatraNFTContract.abi,
            CleopatraNFTContract.bytecode,
            signer
        );

        // Get current gas price
        const gasPrice = await provider.getGasPrice();
        console.log("\nGas Parameters:");
        console.log("- Current base gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

        // Deploy with fixed gas limit and dynamic gas price
        console.log("Deploying contract...");
        const contract = await factory.deploy(DOOM_COIN_ADDRESS, {
            gasLimit: 3000000, // Fixed gas limit that should cover deployment
            maxFeePerGas: gasPrice.mul(2), // Double the base gas price
            maxPriorityFeePerGas: ethers.utils.parseUnits("1", "gwei") // 1 gwei priority fee
        });
        
        console.log("Deployment transaction sent!");
        console.log("Transaction hash:", contract.deployTransaction.hash);
        
        console.log("\nWaiting for deployment confirmation...");
        const receipt = await contract.deployTransaction.wait();
        
        if (receipt.status === 0) {
            throw new Error("Contract deployment failed - transaction reverted");
        }
        
        console.log("\nDeployment successful!");
        console.log("Contract deployed to:", contract.address);
        console.log("Block number:", receipt.blockNumber);
        console.log("Gas used:", receipt.gasUsed.toString());
        
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
        
        throw error;
    }
};