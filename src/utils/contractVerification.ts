import { ethers } from "ethers";
import { toast } from "@/components/ui/use-toast";

export const verifyContractDeployment = async (
  contractAddress: string,
  provider: ethers.providers.Provider
): Promise<boolean> => {
  try {
    console.log("Verifying contract deployment at:", contractAddress);
    
    // Check if the address is valid
    if (!ethers.utils.isAddress(contractAddress)) {
      console.error("Invalid contract address format");
      toast({
        title: "Invalid Contract Address",
        description: "The contract address format is invalid.",
        variant: "destructive",
      });
      return false;
    }

    // Check if there's any code at the address
    const code = await provider.getCode(contractAddress);
    const isDeployed = code !== "0x";
    
    console.log("Contract deployment status:", {
      address: contractAddress,
      hasCode: isDeployed,
      codeLength: code.length
    });

    if (!isDeployed) {
      toast({
        title: "Contract Not Found",
        description: "No contract was found at this address. The deployment might have failed or is still pending.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying contract:", error);
    toast({
      title: "Verification Error",
      description: "Failed to verify contract deployment. Please check the console for details.",
      variant: "destructive",
    });
    return false;
  }
};