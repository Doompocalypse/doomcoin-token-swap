import { ethers } from "ethers";
import { DOOM_COIN_ADDRESS, SEPOLIA_RPC_URL } from "../constants/deploymentConstants";

export async function verifyDMCToken(provider: ethers.providers.Provider) {
    console.log("\nStarting DMC token contract verification...");
    console.log("DMC Token Address:", DOOM_COIN_ADDRESS);
    
    try {
        // First verify network
        const network = await provider.getNetwork();
        console.log("Current network:", network.name, "chainId:", network.chainId);
        
        if (network.chainId !== 11155111) { // Sepolia chainId
            throw new Error("Please switch to Sepolia network for deployment");
        }

        // Then verify contract
        const code = await provider.getCode(DOOM_COIN_ADDRESS);
        console.log("Contract bytecode length:", code.length);
        
        if (code === "0x" || code.length < 3) {
            throw new Error("No contract found at the specified DMC token address");
        }

        // Try to make a basic call to the contract to verify it's responsive
        const contract = new ethers.Contract(
            DOOM_COIN_ADDRESS,
            ["function name() view returns (string)"],
            provider
        );

        try {
            await contract.name();
            console.log("✅ DMC token contract verified successfully");
        } catch (error) {
            console.error("Error calling contract:", error);
            throw new Error("Contract exists but doesn't respond to basic calls. It might not be the correct contract.");
        }

    } catch (error: any) {
        console.error("Error during DMC token verification:", error);
        throw new Error(`Failed to verify DMC token contract: ${error.message}`);
    }
}

export async function verifyDeployerBalance(signer: ethers.Signer) {
    const balance = await signer.getBalance();
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log("Deployer Balance:", balanceInEth, "ETH");
    
    if (balance.lt(ethers.utils.parseEther("0.01"))) {
        throw new Error("Insufficient ETH balance for deployment. Please ensure you have at least 0.01 ETH");
    }
}

export async function logDeploymentParams(signer: ethers.Signer) {
    const deployerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();
    
    console.log("\nDeployment Parameters:");
    console.log("Network:", network?.name);
    console.log("Chain ID:", network?.chainId);
    console.log("DMC Token Address:", DOOM_COIN_ADDRESS);
    console.log("Deployer Address:", deployerAddress);
}