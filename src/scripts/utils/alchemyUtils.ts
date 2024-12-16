import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

export const initializeAlchemy = async () => {
    console.log("Initializing Alchemy SDK...");
    
    try {
        const { data: alchemyApiKey, error: secretError } = await supabase.rpc('get_secret', {
            secret_name: 'ALCHEMY_API_KEY'
        });

        if (secretError) {
            console.error("Failed to get Alchemy API key:", secretError);
            throw new Error("Failed to get Alchemy API key from Supabase. Error: " + secretError.message);
        }

        if (!alchemyApiKey) {
            console.error("Alchemy API key not found in Supabase secrets");
            throw new Error("Alchemy API key not found. Please add it to your Supabase secrets using the form above.");
        }

        console.log("Successfully retrieved Alchemy API key");
        
        return new Alchemy({
            apiKey: alchemyApiKey,
            network: Network.ETH_SEPOLIA
        });
    } catch (error: any) {
        console.error("Error initializing Alchemy:", error);
        throw new Error("Failed to get Alchemy API key. Please make sure it's set in Supabase secrets.");
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