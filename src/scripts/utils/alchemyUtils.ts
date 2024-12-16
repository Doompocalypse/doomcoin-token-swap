import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

export const initializeAlchemy = async () => {
    console.log("Initializing Alchemy SDK...");
    
    try {
        console.log("Fetching Alchemy API key from Supabase...");
        const { data, error: secretError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'ALCHEMY_API_KEY')
            .single();

        if (secretError) {
            console.error("Failed to fetch Alchemy API key from Supabase:", secretError);
            throw new Error(`Failed to fetch Alchemy API key: ${secretError.message}`);
        }

        if (!data || !data.value || data.value.trim() === '') {
            console.error("No valid Alchemy API key found in app_settings");
            throw new Error("No valid Alchemy API key found in app_settings. Please ensure you've added a non-empty API key.");
        }

        const alchemyApiKey = data.value;
        console.log("Successfully retrieved Alchemy API key");
        
        const alchemy = new Alchemy({
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA
        });

        // Test the connection
        try {
            console.log("Testing Alchemy connection...");
            await alchemy.core.getBlockNumber();
            console.log("✅ Successfully connected to Alchemy");
            return alchemy;
        } catch (error) {
            console.error("Failed to connect to Alchemy:", error);
            throw new Error("Failed to connect to Alchemy. Please check if your API key is valid.");
        }
    } catch (error: any) {
        console.error("Error in initializeAlchemy:", error);
        // Re-throw the error with the original message to preserve the error context
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
        throw new Error("Failed to fetch contract template. Please try again.");
    }
};