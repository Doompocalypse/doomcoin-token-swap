import { ethers } from "ethers";
import { DOOM_COIN_ADDRESS } from "../constants/deploymentConstants";

export async function verifyDMCToken(provider: ethers.providers.Provider) {
    console.log("Verifying DMC token contract...");
    const code = await provider.getCode(DOOM_COIN_ADDRESS);
    if (code === "0x") {
        throw new Error("DMC token contract not found at the specified address");
    }
    console.log("✅ DMC token contract verified");
}

export async function verifyDeployerBalance(signer: ethers.Signer) {
    const balance = await signer.getBalance();
    console.log("- Deployer Balance:", ethers.utils.formatEther(balance), "ETH");
    
    if (balance.eq(0)) {
        throw new Error("Deployer has no ETH balance");
    }
}

export async function logDeploymentParams(signer: ethers.Signer) {
    const deployerAddress = await signer.getAddress();
    console.log("\nDeployment Parameters:");
    console.log("- DMC Token Address:", DOOM_COIN_ADDRESS);
    console.log("- Deployer Address:", deployerAddress);
}