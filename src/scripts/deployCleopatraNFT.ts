import { ethers } from "ethers";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

export const deployCleopatraNFT = async (signer: ethers.Signer) => {
    console.log("Starting deployment of Cleopatra's Necklace NFT contract...");
    
    const DOOM_COIN_ADDRESS = "0xe0a5AC02b20C9a7E08D6F9C75134D35B1AfC6073";
    
    try {
        const factory = new ethers.ContractFactory(
            CleopatraNFTContract.abi,
            CleopatraNFTContract.bytecode,
            signer
        );
        
        const contract = await factory.deploy(DOOM_COIN_ADDRESS);
        await contract.deployed();
        
        console.log("Contract deployed to:", contract.address);
        return contract;
    } catch (error) {
        console.error("Error deploying contract:", error);
        throw error;
    }
};