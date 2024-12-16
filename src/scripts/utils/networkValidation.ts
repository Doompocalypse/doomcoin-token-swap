import { ethers } from "ethers";

export const validateNetwork = async (signer: ethers.Signer) => {
    const network = await signer.provider?.getNetwork();
    console.log("Connected to network:", {
        name: network?.name,
        chainId: network?.chainId
    });
    
    if (!network) {
        throw new Error("No network detected. Please check your wallet connection.");
    }

    if (network.chainId !== 11155111) { // Sepolia chainId
        throw new Error("Please switch to Sepolia network for deployment. Current network: " + network.name);
    }
    
    return network;
};

export const validateBalance = async (signer: ethers.Signer) => {
    const balance = await signer.getBalance();
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log("Deployer balance:", balanceInEth, "ETH");
    
    if (balance.lt(ethers.utils.parseEther("0.01"))) {
        throw new Error(`Insufficient balance for deployment. Current balance: ${balanceInEth} ETH. Need at least 0.01 ETH`);
    }
    
    return balance;
};