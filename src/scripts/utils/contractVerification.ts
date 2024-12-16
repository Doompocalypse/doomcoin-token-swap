import { ethers } from "ethers";
import { DOOM_COIN_ADDRESS, SEPOLIA_RPC_URL } from "../constants/deploymentConstants";

export async function verifyDMCToken(provider: ethers.providers.Provider) {
    console.log("Verifying DMC token contract...");
    
    // Try both the connected provider and a direct Sepolia RPC connection
    const backupProvider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
    
    try {
        const code = await provider.getCode(DOOM_COIN_ADDRESS);
        if (code === "0x") {
            // Try backup provider
            const backupCode = await backupProvider.getCode(DOOM_COIN_ADDRESS);
            if (backupCode === "0x") {
                throw new Error("DMC token contract not found at the specified address");
            }
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
}