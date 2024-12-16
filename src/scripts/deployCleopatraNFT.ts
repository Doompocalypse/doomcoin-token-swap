import { ethers } from "ethers";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

export const deployCleopatraNFT = async (signer: ethers.Signer) => {
    console.log("Starting deployment of Cleopatra's Necklace NFT contract...");
    
    const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    
    try {
        // Create contract factory with gas limit
        const factory = new ethers.ContractFactory(
            CleopatraNFTContract.abi,
            CleopatraNFTContract.bytecode,
            signer
        );
        
        // Deploy with specific gas limit and wait for deployment
        const contract = await factory.deploy(DOOM_COIN_ADDRESS, {
            gasLimit: 3000000 // Set a reasonable gas limit
        });
        
        console.log("Waiting for deployment transaction...");
        await contract.deployed();
        
        console.log("Contract deployed to:", contract.address);
        return contract;
    } catch (error: any) {
        console.error("Error deploying contract:", error);
        if (error.code === -32000) {
            throw new Error("Gas estimation failed. Please try again with a different gas limit.");
        }
        throw error;
    }
};