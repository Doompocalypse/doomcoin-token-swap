import { ethers } from "ethers";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

export const deployCleopatraNFT = async (signer: ethers.Signer) => {
    console.log("Starting deployment of Cleopatra's Necklace NFT contract...");
    
    const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    
    try {
        // Log deployment parameters
        console.log("DMC Token Address:", DOOM_COIN_ADDRESS);
        console.log("Deployer Address:", await signer.getAddress());
        
        // Verify signer has enough balance
        const balance = await signer.getBalance();
        console.log("Deployer Balance:", ethers.utils.formatEther(balance), "ETH");
        
        // Create contract factory with gas limit
        const factory = new ethers.ContractFactory(
            CleopatraNFTContract.abi,
            CleopatraNFTContract.bytecode,
            signer
        );
        
        // Deploy with specific gas limit and wait for deployment
        console.log("Deploying contract...");
        const contract = await factory.deploy(DOOM_COIN_ADDRESS, {
            gasLimit: 3000000 // Set a reasonable gas limit
        });
        
        console.log("Waiting for deployment transaction...");
        await contract.deployed();
        
        console.log("Contract deployed to:", contract.address);
        return contract;
    } catch (error: any) {
        console.error("Error deploying contract:", error);
        
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
        
        throw error;
    }
};