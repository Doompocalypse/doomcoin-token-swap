import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const SEPOLIA_CHAIN_ID = "0xaa36a7";

export const getInfuraConfig = async () => {
  const { data: infuraProjectId, error: secretError } = await supabase.rpc('get_secret', {
    secret_name: 'INFURA_PROJECT_ID'
  });

  console.log("Attempting to fetch Infura Project ID...");

  if (secretError) {
    console.error("Error fetching Infura Project ID:", secretError);
    toast({
      title: "Network Configuration Error",
      description: "Could not fetch network configuration. Please try again or contact support.",
      variant: "destructive"
    });
    throw new Error(`Failed to fetch network configuration: ${secretError.message}`);
  }

  if (!infuraProjectId || infuraProjectId.trim() === '') {
    console.error("Invalid Infura Project ID configuration");
    toast({
      title: "Missing Configuration",
      description: "Infura Project ID is not properly configured.",
      variant: "destructive"
    });
    throw new Error("Invalid Infura Project ID configuration");
  }

  return infuraProjectId;
};