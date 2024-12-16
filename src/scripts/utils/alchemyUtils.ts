import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

export const initializeAlchemy = async () => {
    console.log("Initializing Alchemy SDK...");
    
    try {
        const { data: alchemyApiKey, error: secretError } = await supabase.rpc('get_secret', {
            secret_name: 'ALCHEMY_API_KEY'
        });

        if (secretError) {
            console.error("Failed to fetch Alchemy API key from Supabase:", secretError);
            throw new Error(`Failed to fetch Alchemy API key: ${secretError.message}`);
        }

        if (!alchemyApiKey) {
            console.error("No Alchemy API key found in response");
            throw new Error("Alchemy API key not found in Supabase secrets");
        }

        console.log("Successfully retrieved Alchemy API key");
        
        const alchemy = new Alchemy({
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA
        });

        // Test the connection
        try {
            await alchemy.core.getBlockNumber();
            console.log("Successfully connected to Alchemy");
            return alchemy;
        } catch (error) {
            console.error("Failed to connect to Alchemy:", error);
            throw new Error("Failed to connect to Alchemy. Please check if your API key is valid.");
        }
    } catch (error: any) {
        console.error("Error initializing Alchemy:", error);
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