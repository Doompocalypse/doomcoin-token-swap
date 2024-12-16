import { Alchemy, Network, AlchemySettings } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const verifyConnection = async (alchemy: Alchemy): Promise<boolean> => {
    try {
        const network = await alchemy.core.getNetwork();
        console.log("Connected to Alchemy network:", network.name);
        
        if (network.name !== "sepolia") {
            throw new Error(`Connected to wrong network: ${network.name}. Expected: sepolia`);
        }
        
        const blockNumber = await alchemy.core.getBlockNumber();
        console.log("✅ Successfully connected to Alchemy. Current block number:", blockNumber);
        
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

        if (!alchemyApiKey) {
            console.error("No Alchemy API key found");
            throw new Error("No Alchemy API key found in Supabase secrets");
        }

        console.log("Successfully retrieved Alchemy API key");

        const settings: AlchemySettings = {
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA,
            maxRetries: MAX_RETRIES,
            requestTimeout: 30000 // 30 seconds
        };

        let retryCount = 0;
        while (retryCount < MAX_RETRIES) {
            const alchemy = new Alchemy(settings);
            const isConnected = await verifyConnection(alchemy);
            
            if (isConnected) {
                return alchemy;
            }
            
            retryCount++;
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying Alchemy connection (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
                await delay(RETRY_DELAY);
            }
        }
        
        throw new Error("Failed to establish Alchemy connection after multiple attempts");
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