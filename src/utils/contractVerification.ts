import { ethers } from "ethers";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

export const isContractDeployed = async (provider: ethers.providers.Provider, address: string) => {
    try {
        console.log("Checking if contract is deployed at:", address);
        const code = await provider.getCode(address);
        const isDeployed = code !== "0x";
        console.log("Contract deployed status:", isDeployed);
        return isDeployed;
    } catch (error) {
        console.error("Error checking contract deployment:", error);
        return false;
    }
};

export const verifyContractCode = async (provider: ethers.providers.Provider, address: string) => {
    try {
        console.log("Verifying contract code at:", address);
        const contract = new ethers.Contract(address, CleopatraNFTContract.abi, provider);
        await contract.name();
        console.log("Contract verification successful");
        return true;
    } catch (error) {
        console.error("Contract verification failed:", error);
        return false;
    }
};