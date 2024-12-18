import { useEffect } from "react";
import { useDeploymentContext } from "./DeploymentProvider";

const STORAGE_KEY = "nft_deployment_status";

export const useDeploymentStorage = (onContractDeployed?: (address: string) => void) => {
  const { contractAddress, transactionHash } = useDeploymentContext();

  useEffect(() => {
    if (contractAddress) {
      console.log("Contract address updated:", contractAddress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        contractAddress,
        transactionHash,
        timestamp: Date.now()
      }));
      onContractDeployed?.(contractAddress);
    }
  }, [contractAddress, transactionHash, onContractDeployed]);
};