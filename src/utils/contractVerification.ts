import { ethers } from "ethers";
import { toast } from "@/components/ui/use-toast";
import CleopatraNFTContract from "../contracts/CleopatraNecklaceNFT.json";

export const isContractDeployed = async (
  provider: ethers.providers.Provider,
  contractAddress: string
): Promise<boolean> => {
  try {
    console.log("Checking if contract is deployed at:", contractAddress);
    
    // Check if the address is valid
    if (!ethers.utils.isAddress(contractAddress)) {
      console.error("Invalid contract address format");
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

    return isDeployed;
  } catch (error) {
    console.error("Error checking contract deployment:", error);
    return false;
  }
};

export const verifyContractCode = async (
  provider: ethers.providers.Provider,
  contractAddress: string
): Promise<boolean> => {
  try {
    console.log("Verifying contract code at:", contractAddress);
    
    // Try to interact with the contract to verify its functionality
    const contract = new ethers.Contract(
      contractAddress,
      CleopatraNFTContract.abi,
      provider
    );
    
    // Try to call a view function to verify the contract
    await contract.tokenURI(1);
    
    console.log("Contract code verification successful - contract responds to function calls");
    return true;
  } catch (error) {
    console.error("Contract code verification failed:", error);
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

    return isValid;
  } catch (error) {
    console.error("Error verifying bytecode:", error);
    return false;
  }
};