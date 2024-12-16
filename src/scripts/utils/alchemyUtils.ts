import { Alchemy, Network, AlchemySettings } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

export const initializeAlchemy = async () => {
    console.log("Initializing Alchemy SDK...");
    
    try {
        console.log("Fetching Alchemy API key from Supabase...");
        const { data, error } = await supabase.rpc('get_secret', {
            secret_name: 'ALCHEMY_API_KEY'
        });

        if (error) {
            console.error("Failed to fetch Alchemy API key:", error);
            throw new Error(`Failed to fetch Alchemy API key: ${error.message}`);
        }

        if (!data) {
            console.error("No Alchemy API key found");
            throw new Error("No Alchemy API key found");
        }

        const alchemyApiKey = data;
        console.log("Successfully retrieved Alchemy API key");

        // Define explicit settings for Alchemy SDK
        const settings: AlchemySettings = {
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA,
            maxRetries: 3
        };

        console.log("Initializing Alchemy with settings:", {
            network: settings.network,
            maxRetries: settings.maxRetries
        });

        const alchemy = new Alchemy(settings);

        // Verify the Alchemy instance is properly initialized
        if (!alchemy) {
            throw new Error("Failed to create Alchemy instance");
        }

        // Verify core functionality is available
        if (!alchemy.core) {
            throw new Error("Alchemy core functionality not available");
        }

        // Test the connection with proper error handling
        try {
            console.log("Testing Alchemy connection...");
            const blockNumber = await alchemy.core.getBlockNumber();
            console.log("✅ Successfully connected to Alchemy. Current block number:", blockNumber);
            return alchemy;
        } catch (error: any) {
            console.error("Failed to test Alchemy connection:", error);
            throw new Error(`Alchemy connection test failed: ${error.message}`);
        }
    } catch (error: any) {
        console.error("Error in initializeAlchemy:", error);
        throw error;
    }
};

export const fetchContractTemplate = async (alchemy: Alchemy) => {
    console.log("Fetching contract template...");
    try {
        if (!alchemy?.core) {
            throw new Error("Invalid Alchemy instance - core functionality not available");
        }

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