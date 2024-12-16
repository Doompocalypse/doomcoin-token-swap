import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

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
            throw new Error("No Alchemy API key found");
        }

        console.log("Successfully retrieved Alchemy API key");

        // Create Alchemy instance with explicit network configuration
        const settings = {
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA
        };

        console.log("Creating Alchemy instance with settings:", {
            network: Network.ETH_SEPOLIA
        });

        // Initialize Alchemy with settings
        const alchemy = new Alchemy(settings);

        // Test connection immediately to verify setup
        try {
            const blockNumber = await alchemy.core.getBlockNumber();
            console.log("✅ Successfully connected to Alchemy. Current block number:", blockNumber);
            return alchemy;
        } catch (error: any) {
            console.error("Failed to test Alchemy connection:", error);
            throw new Error("Failed to connect to Alchemy network. Please check your API key and network settings.");
        }
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