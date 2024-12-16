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
            throw new Error("No Alchemy API key found in Supabase secrets");
        }

        console.log("Successfully retrieved Alchemy API key");

        // Initialize Alchemy with explicit network configuration
        const settings = {
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA,
            maxRetries: 5,
            requestTimeout: 30000, // 30 seconds
        };

        console.log("Creating Alchemy instance with network:", Network.ETH_SEPOLIA);

        const alchemy = new Alchemy(settings);

        // Verify the connection immediately
        try {
            const blockNumber = await alchemy.core.getBlockNumber();
            console.log("✅ Successfully connected to Alchemy. Current block number:", blockNumber);
            
            // Additional verification of core functionality
            const network = await alchemy.core.getNetwork();
            console.log("Connected to network:", network.name);
            
            return alchemy;
        } catch (error: any) {
            console.error("Failed to verify Alchemy connection:", error);
            throw new Error(
                "Failed to verify Alchemy connection. Please ensure your API key has access to Sepolia network."
            );
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