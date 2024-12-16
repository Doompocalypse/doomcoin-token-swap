import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

export const initializeAlchemy = async () => {
    console.log("Initializing Alchemy SDK...");
    
    try {
        console.log("Fetching Alchemy API key from Supabase...");
        const { data, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'ALCHEMY_API_KEY')
            .single();

        if (error) {
            console.error("Failed to fetch Alchemy API key:", error);
            throw new Error(`Failed to fetch Alchemy API key: ${error.message}`);
        }

        if (!data?.value) {
            console.error("No Alchemy API key found in app_settings");
            throw new Error("No Alchemy API key found in app_settings");
        }

        const alchemyApiKey = data.value;
        console.log("Successfully retrieved Alchemy API key");

        // Initialize Alchemy with Sepolia network
        const alchemy = new Alchemy({
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA
        });

        // Test the connection
        try {
            console.log("Testing Alchemy connection...");
            const blockNumber = await alchemy.core.getBlockNumber();
            console.log("✅ Successfully connected to Alchemy. Current block number:", blockNumber);
            return alchemy;
        } catch (error: any) {
            console.error("Failed to test Alchemy connection:", error);
            throw new Error(`Failed to test Alchemy connection: ${error.message}`);
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
            throw new Error("Failed to fetch contract template");
        }
        
        console.log("Successfully fetched contract template");
        return response;
    } catch (error: any) {
        console.error("Error fetching contract template:", error);
        throw new Error(`Failed to fetch contract template: ${error.message}`);
    }
};