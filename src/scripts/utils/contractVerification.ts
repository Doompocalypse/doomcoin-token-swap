import { ethers } from "ethers";
import { DOOM_COIN_ADDRESS, SEPOLIA_RPC_URL } from "../constants/deploymentConstants";

export async function verifyDMCToken(provider: ethers.providers.Provider) {
    console.log("Verifying DMC token contract...");
    console.log("DMC Token Address:", DOOM_COIN_ADDRESS);
    
    try {
        const code = await provider.getCode(DOOM_COIN_ADDRESS);
        console.log("Contract code length:", code.length);
        
        if (code === "0x") {
            console.log("No contract code found at address, checking network...");
            const network = await provider.getNetwork();
            console.log("Current network:", network.name, "chainId:", network.chainId);
            throw new Error("DMC token contract not found at the specified address");
        }
        console.log("✅ DMC token contract verified");
    } catch (error) {
        console.error("Error verifying DMC token:", error);
        throw new Error("Failed to verify DMC token contract. Please check the contract address and network connection.");
    }
}

export async function verifyDeployerBalance(signer: ethers.Signer) {
    const balance = await signer.getBalance();
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log("- Deployer Balance:", balanceInEth, "ETH");
}

export async function logDeploymentParams(signer: ethers.Signer) {
    const deployerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();
    
    console.log("\nDeployment Parameters:");
    console.log("- Network:", network?.name);
    console.log("- Chain ID:", network?.chainId);
    console.log("- DMC Token Address:", DOOM_COIN_ADDRESS);
    console.log("- Deployer Address:", deployerAddress);
    
    // Additional network verification
    if (network?.chainId !== 11155111) { // Sepolia chainId
        console.warn("⚠️ Warning: Not deploying to Sepolia network!");
    }
}