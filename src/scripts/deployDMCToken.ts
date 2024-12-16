import { ethers } from "ethers";
import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

// Complete ERC20 ABI with all essential functions
const DMC_TOKEN_ABI = [
    "constructor(string name, string symbol)",
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
            console.error("Failed to get Alchemy API key:", secretError);
            throw new Error("Failed to get Alchemy API key. Please make sure it's set in Supabase secrets.");
        }

        // Initialize Alchemy SDK with better error handling
        console.log("Initializing Alchemy SDK...");
        const alchemy = new Alchemy({
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA
        });

        // Verify network and signer
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

        // Check deployer balance with more detailed feedback
        const balance = await signer.getBalance();
        const balanceInEth = ethers.utils.formatEther(balance);
        console.log("Deployer balance:", balanceInEth, "ETH");
        
        if (balance.lt(ethers.utils.parseEther("0.01"))) {
            throw new Error(`Insufficient balance for deployment. Current balance: ${balanceInEth} ETH. Need at least 0.01 ETH`);
        }

        // Get bytecode from a verified contract template
        console.log("Fetching contract template...");
        const response = await alchemy.core.getContract("0x6B175474E89094C44Da98b954EedeAC495271d0F"); // DAI contract
        
        if (!response || !response.address) {
            throw new Error("Failed to fetch contract template");
        }

        // Create contract factory with proper initialization parameters
        console.log("Creating contract factory...");
        const factory = new ethers.ContractFactory(
            DMC_TOKEN_ABI,
            response.bytecode,
            signer
        );

        // Deploy with explicit gas settings and constructor arguments
        console.log("Deploying contract...");
        const contract = await factory.deploy(
            "DMC Token",  // name
            "DMC",       // symbol
            {
                gasLimit: 3000000,
                gasPrice: await signer.provider?.getGasPrice()
            }
        );
        
        console.log("Deployment transaction hash:", contract.deployTransaction.hash);
        console.log("Waiting for deployment confirmation...");
        
        await contract.deployed();
        
        // Verify deployment success
        const deployedCode = await signer.provider?.getCode(contract.address);
        if (!deployedCode || deployedCode === "0x") {
            throw new Error("Contract deployment verification failed");
        }
        
        // Verify basic contract functionality
        const name = await contract.name();
        const symbol = await contract.symbol();
        console.log("Contract deployed and verified:", {
            address: contract.address,
            name,
            symbol
        });
        
        return contract;
        
    } catch (error: any) {
        console.error("Deployment error details:", error);
        
        // Enhanced error messages for common issues
        if (error.code === "INSUFFICIENT_FUNDS") {
            throw new Error("Not enough ETH to deploy contract. Please ensure you have sufficient Sepolia ETH.");
        }
        
        if (error.code === "NETWORK_ERROR") {
            throw new Error("Network connection issue. Please check your internet connection and wallet connection.");
        }
        
        if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
            throw new Error("Gas estimation failed. The contract might be invalid or the network might be congested.");
        }
        
        // Include transaction details in error if available
        if (error.transaction) {
            console.error("Failed transaction details:", {
                from: error.transaction.from,
                to: error.transaction.to,
                gasLimit: error.transaction.gasLimit?.toString(),
                value: error.transaction.value?.toString()
            });
        }
        
        throw error;
    }
};