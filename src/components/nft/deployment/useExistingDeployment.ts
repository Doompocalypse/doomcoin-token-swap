import { useEffect } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { isContractDeployed, verifyContractBytecode } from "@/utils/contractVerification";
import { useDeploymentContext } from "./DeploymentProvider";

const KNOWN_DEPLOYMENT = "0xce4cd90711fedba2634a794aebcacae15c6925b3cb46d60f4da1f476706722da";
const STORAGE_KEY = "nft_deployment_status";

export const useExistingDeployment = (onContractDeployed?: (address: string) => void) => {
  const { toast } = useToast();
  const {
    setIsAlreadyDeployed,
    setContractAddress,
    setTransactionHash,
  } = useDeploymentContext();

  useEffect(() => {
    const checkExistingDeployment = async () => {
      if (!window.ethereum) return;
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // First check local storage
        const savedStatus = localStorage.getItem(STORAGE_KEY);
        if (savedStatus) {
          const { contractAddress: savedAddress, transactionHash: savedHash } = JSON.parse(savedStatus);
          console.log("Found saved deployment status:", { savedAddress, savedHash });
          
          if (savedAddress) {
            const isDeployed = await isContractDeployed(provider, savedAddress);
            const isValid = await verifyContractBytecode(savedAddress, provider);
            
            if (isDeployed && isValid) {
              console.log("Restored valid deployment from storage:", savedAddress);
              setIsAlreadyDeployed(true);
              setContractAddress(savedAddress);
              setTransactionHash(savedHash);
              onContractDeployed?.(savedAddress);
              return;
            }
          }
        }

        // Fallback to checking known deployment
        const receipt = await provider.getTransactionReceipt(KNOWN_DEPLOYMENT);
        
        if (receipt && receipt.contractAddress) {
          console.log("Found existing deployment at:", receipt.contractAddress);
          const isDeployed = await isContractDeployed(provider, receipt.contractAddress);
          const isValid = await verifyContractBytecode(receipt.contractAddress, provider);
          
          if (isDeployed && isValid) {
            setIsAlreadyDeployed(true);
            setContractAddress(receipt.contractAddress);
            setTransactionHash(KNOWN_DEPLOYMENT);
            onContractDeployed?.(receipt.contractAddress);
            toast({
              title: "Contract Already Deployed",
              description: "The NFT contract has already been deployed successfully.",
            });
          }
        }
      } catch (error) {
        console.error("Error checking existing deployment:", error);
      }
    };

    checkExistingDeployment();
  }, [toast, setIsAlreadyDeployed, setContractAddress, setTransactionHash, onContractDeployed]);
};