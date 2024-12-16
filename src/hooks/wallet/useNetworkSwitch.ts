import { validateCurrentNetwork } from "./network/networkValidation";
import { addSepoliaNetwork, switchToSepoliaNetwork } from "./network/networkOperations";
import { getInfuraConfig } from "./network/networkConfig";

export const useNetworkSwitch = () => {
  const switchToSepolia = async (provider: any) => {
    try {
      const { currentChainId, isCorrectNetwork } = await validateCurrentNetwork(provider);
      
      if (!isCorrectNetwork) {
        try {
          await switchToSepoliaNetwork(provider);
        } catch (switchError: any) {
          console.error("Network switch error:", switchError);
          
          if (switchError.code === 4902) {
            const infuraProjectId = await getInfuraConfig();
            await addSepoliaNetwork(provider, infuraProjectId);
          } else {
            throw switchError;
          }
        }
      } else {
        console.log("Already on Sepolia network");
      }
    } catch (error: any) {
      console.error("Error in switchToSepolia:", error);
      throw error;
    }
  };

  return { switchToSepolia };
};