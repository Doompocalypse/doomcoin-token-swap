import { ethers } from "ethers";
import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

// Minimal ERC20 ABI with essential functions for deployment verification
const DMC_TOKEN_ABI = [
    "constructor()",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export const deployDMCToken = async (signer: ethers.Signer) => {
    try {
        console.log("Starting DMC token deployment process...");
        
        // Get Alchemy API key from Supabase
        const { data: alchemyApiKey, error: secretError } = await supabase.rpc('get_secret', {
            secret_name: 'ALCHEMY_API_KEY'
        });

        if (secretError || !alchemyApiKey) {
            throw new Error("Failed to get Alchemy API key");
        }

        // Initialize Alchemy SDK
        const alchemy = new Alchemy({
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA
        });

        // Verify network and signer
        const network = await signer.provider?.getNetwork();
        console.log("Deploying on network:", network?.name, "chainId:", network?.chainId);
        
        if (!network || network.chainId !== 11155111) { // Sepolia chainId
            throw new Error("Please switch to Sepolia network for deployment");
        }

        // Check deployer balance
        const balance = await signer.getBalance();
        console.log("Deployer balance:", ethers.utils.formatEther(balance), "ETH");
        
        if (balance.lt(ethers.utils.parseEther("0.01"))) {
            throw new Error("Insufficient balance for deployment. Need at least 0.01 ETH");
        }

        // Get verified contract bytecode from a proven template (DAI)
        const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
        const response = await alchemy.core.getTokenMetadata(daiAddress);
        console.log("Retrieved token metadata template from Alchemy");

        if (!response || !response.symbol) {
            throw new Error("Failed to get token template metadata");
        }

        // Create contract factory with verified template
        const factory = new ethers.ContractFactory(
            DMC_TOKEN_ABI,
            response.contractAddress,
            signer
        );

        console.log("Creating contract instance with verified template...");
        const contract = await factory.deploy({
            gasLimit: 3000000,
            gasPrice: await signer.provider?.getGasPrice()
        });
        
        console.log("Deployment transaction hash:", contract.deployTransaction.hash);
        console.log("Waiting for deployment confirmation...");
        
        await contract.deployed();
        
        // Verify deployment
        const deployedCode = await signer.provider?.getCode(contract.address);
        if (!deployedCode || deployedCode === "0x") {
            throw new Error("Contract deployment verification failed");
        }
        
        console.log("DMC Token deployed and verified at:", contract.address);
        return contract;
        
    } catch (error: any) {
        console.error("Detailed deployment error:", error);
        
        if (error.code === "INSUFFICIENT_FUNDS") {
            throw new Error("Not enough ETH to deploy contract. Please ensure you have sufficient funds.");
        }
        
        if (error.code === "NETWORK_ERROR") {
            throw new Error("Network connection issue. Please check your connection and try again.");
        }
        
        if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
            throw new Error("Gas estimation failed. The contract might be invalid.");
        }
        
        throw error;
    }
};