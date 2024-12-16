import { Alchemy, Network } from "@alch/alchemy-sdk";
import { supabase } from "@/integrations/supabase/client";

export const initializeAlchemy = async () => {
    console.log("Initializing Alchemy SDK...");
    
    const { data: alchemyApiKey, error: secretError } = await supabase.rpc('get_secret', {
        secret_name: 'ALCHEMY_API_KEY'
    });

    if (secretError || !alchemyApiKey) {
        console.error("Failed to get Alchemy API key:", secretError);
        throw new Error("Failed to get Alchemy API key. Please make sure it's set in Supabase secrets.");
    }

    return new Alchemy({
        apiKey: alchemyApiKey,
        network: Network.ETH_SEPOLIA
    });
};

export const fetchContractTemplate = async (alchemy: Alchemy) => {
    console.log("Fetching contract template...");
    const response = await alchemy.core.getContract("0x6B175474E89094C44Da98b954EedeAC495271d0F");
    
    if (!response || !response.address) {
        throw new Error("Failed to fetch contract template");
    }
    
    return response;
};