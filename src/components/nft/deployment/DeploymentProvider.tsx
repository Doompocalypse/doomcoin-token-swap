import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

interface DeploymentContextType {
  isDeploying: boolean;
  setIsDeploying: (value: boolean) => void;
  contractAddress: string;
  setContractAddress: (value: string) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
  transactionHash: string;
  setTransactionHash: (value: string) => void;
  estimatedGasCost: ethers.BigNumber | undefined;
  setEstimatedGasCost: (value: ethers.BigNumber | undefined) => void;
  pendingTx: string;
  setPendingTx: (value: string) => void;
  isAlreadyDeployed: boolean;
  setIsAlreadyDeployed: (value: boolean) => void;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

export const DeploymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [estimatedGasCost, setEstimatedGasCost] = useState<ethers.BigNumber>();
  const [pendingTx, setPendingTx] = useState("");
  const [isAlreadyDeployed, setIsAlreadyDeployed] = useState(false);

  return (
    <DeploymentContext.Provider
      value={{
        isDeploying,
        setIsDeploying,
        contractAddress,
        setContractAddress,
        errorMessage,
        setErrorMessage,
        transactionHash,
        setTransactionHash,
        estimatedGasCost,
        setEstimatedGasCost,
        pendingTx,
        setPendingTx,
        isAlreadyDeployed,
        setIsAlreadyDeployed,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
};

export const useDeploymentContext = () => {
  const context = useContext(DeploymentContext);
  if (context === undefined) {
    throw new Error("useDeploymentContext must be used within a DeploymentProvider");
  }
  return context;
};