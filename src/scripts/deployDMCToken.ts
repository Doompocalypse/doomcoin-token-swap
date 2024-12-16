import { ethers } from "ethers";
import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

// Minimal ERC20 ABI with only essential functions
const DMC_TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const deployDMCToken = async (signer: ethers.Signer) => {
    try {
        console.log("Starting DMC token deployment using Alchemy...");
        
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

        const network = await signer.provider?.getNetwork();
        console.log("Deploying on network:", network?.name, "chainId:", network?.chainId);
        
        const balance = await signer.getBalance();
        console.log("Deployer balance:", ethers.utils.formatEther(balance), "ETH");
        
        if (balance.lt(ethers.utils.parseEther("0.01"))) {
            throw new Error("Insufficient balance for deployment. Need at least 0.01 ETH");
        }

        // Get the contract bytecode from Alchemy
        const response = await alchemy.core.getTokenMetadata("0x6B175474E89094C44Da98b954EedeAC495271d0F"); // Using DAI as template
        console.log("Retrieved token metadata from Alchemy");

        // Create contract factory with verified bytecode
        const factory = new ethers.ContractFactory(
            DMC_TOKEN_ABI,
            response.contractAddress, // Using verified contract address as template
            signer
        );

        console.log("Creating contract instance with Alchemy verified template...");
        const contract = await factory.deploy({
            gasLimit: 3000000
        });
        
        console.log("Deployment transaction hash:", contract.deployTransaction.hash);
        console.log("Waiting for deployment confirmation...");
        
        await contract.deployed();
        
        console.log("DMC Token deployed successfully at:", contract.address);
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