import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const verifyConnection = async (alchemy: Alchemy): Promise<boolean> => {
    try {
        // First verify the SDK instance is properly initialized
        if (!alchemy.core) {
            throw new Error("Alchemy SDK not properly initialized");
        }

        // Get the block number to verify RPC connection
        const blockNumber = await alchemy.core.getBlockNumber();
        console.log("Current block number:", blockNumber);
        
        // Verify network configuration
        const network = alchemy.config.getNetwork();
        console.log("Connected to Alchemy network:", network.name);
        
        if (network.name !== Network.ETH_SEPOLIA) {
            throw new Error(`Connected to wrong network: ${network.name}. Expected: ${Network.ETH_SEPOLIA}`);
        }
        
        console.log("✅ Successfully connected to Alchemy on Sepolia network");
        return true;
    } catch (error) {
        console.error("Failed to verify Alchemy connection:", error);
        return false;
    }
};

export const initializeAlchemy = async () => {
    console.log("Initializing Alchemy SDK...");
    
    try {
        console.log("Fetching Alchemy API key from Supabase...");
        const { data: alchemyApiKey, error } = await supabase.rpc('get_secret', {
            secret_name: 'ALCHEMY_API_KEY'
        });

        if (error) {
            console.error("Failed to fetch Alchemy API key:", error);
            throw new Error(`Failed to fetch Alchemy API key: ${error.message}`);
        }

        if (!alchemyApiKey || alchemyApiKey.trim() === '') {
            console.error("No Alchemy API key found");
            throw new Error("No Alchemy API key found in Supabase secrets");
        }

        console.log("Successfully retrieved Alchemy API key");

        // Initialize with required settings
        const settings = {
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA,
            maxRetries: 5
        };

        let retryCount = 0;
        while (retryCount < MAX_RETRIES) {
            try {
                // Create new Alchemy instance
                const alchemy = new Alchemy(settings);
                
                // Verify the connection
                const isConnected = await verifyConnection(alchemy);
                
                if (isConnected) {
                    return alchemy;
                }
            } catch (error) {
                console.error(`Attempt ${retryCount + 1} failed:`, error);
            }
            
            retryCount++;
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying Alchemy connection (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
                await delay(RETRY_DELAY);
            }
        }
        
        throw new Error("Failed to establish Alchemy connection after multiple attempts. Please verify your API key has access to Sepolia network.");
    } catch (error: any) {
        console.error("Error in initializeAlchemy:", error);
        throw error;
    }
};

export const fetchContractTemplate = async (alchemy: Alchemy) => {
    console.log("Fetching contract template...");
    try {
        const response = await alchemy.core.getContract("0x6B175474E89094C44Da98b954EedeAC495271d0F");
        
        if (!response || !response.address) {
            throw new Error("Failed to fetch contract template - invalid response");
        }
        
        console.log("Successfully fetched contract template");
        return response;
    } catch (error: any) {
        console.error("Error fetching contract template:", error);
        throw new Error(`Failed to fetch contract template: ${error.message}`);
    }
};