import { ethers } from "ethers";
import { toast } from "@/components/ui/use-toast";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

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
        description: "No contract was found at this address. The deployment might have failed.",
        variant: "destructive",
      });
      return false;
    }

    // Try to interact with the contract to verify its functionality
    try {
      const contract = new ethers.Contract(
        contractAddress,
        CleopatraNFTContract.abi,
        provider
      );
      
      // Try to call a view function to verify the contract
      await contract.tokenURI(1);
      
      console.log("Contract verification successful - contract responds to function calls");
      return true;
    } catch (error) {
      console.error("Contract verification failed - invalid contract:", error);
      toast({
        title: "Invalid Contract",
        description: "The contract at this address appears to be invalid or corrupted. Please try deploying again.",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    console.error("Error verifying contract:", error);
    toast({
      title: "Verification Error",
      description: "Failed to verify contract deployment. The contract may be invalid.",
      variant: "destructive",
    });
    return false;
  }
};

export const verifyContractBytecode = async (
  contractAddress: string,
  provider: ethers.providers.Provider
): Promise<boolean> => {
  try {
    const deployedBytecode = await provider.getCode(contractAddress);
    // Remove metadata hash from bytecode comparison
    const expectedBytecode = CleopatraNFTContract.bytecode.split("a264")[0];
    const deployedBytecodeStripped = deployedBytecode.split("a264")[0];

    const isValid = deployedBytecodeStripped.includes(expectedBytecode);
    
    console.log("Bytecode verification:", {
      isValid,
      deployedLength: deployedBytecode.length,
      expectedLength: CleopatraNFTContract.bytecode.length
    });

    if (!isValid) {
      toast({
        title: "Invalid Contract",
        description: "The deployed contract's bytecode doesn't match the expected code. Please try deploying again.",
        variant: "destructive",
      });
    }

    return isValid;
  } catch (error) {
    console.error("Error verifying bytecode:", error);
    return false;
  }
};