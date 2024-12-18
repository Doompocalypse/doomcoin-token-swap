import { useToast } from "@/components/ui/use-toast";
import GasEstimator from "./GasEstimator";
import DeploymentStatus from "./DeploymentStatus";
import CollectionInfo from "./CollectionInfo";
import { DeploymentProvider } from "./deployment/DeploymentProvider";
import PendingTransactionHandler from "./components/PendingTransactionHandler";
import DeploymentForm from "./components/DeploymentForm";
import { useExistingDeployment } from "./deployment/useExistingDeployment";
import { usePendingTransactions } from "./deployment/usePendingTransactions";
import { useDeploymentStorage } from "./deployment/useDeploymentStorage";
import { useDeploymentContext } from "./deployment/DeploymentProvider";

interface NFTDeploymentContentProps {
  isMobile: boolean;
  onContractDeployed?: (address: string) => void;
}

const NFTDeploymentContent = ({ isMobile, onContractDeployed }: NFTDeploymentContentProps) => {
  const { setEstimatedGasCost } = useDeploymentContext();

  // Initialize deployment hooks
  useExistingDeployment(onContractDeployed);
  usePendingTransactions();
  useDeploymentStorage(onContractDeployed);

  return (
    <div className="space-y-6 p-6 bg-black/40 rounded-lg">
      <CollectionInfo />
      <GasEstimator onEstimateComplete={setEstimatedGasCost} />
      <PendingTransactionHandler />
      <DeploymentForm isMobile={isMobile} />
      <DeploymentStatus />
    </div>
  );
};

interface NFTDeploymentProps {
  isMobile: boolean;
  onContractDeployed?: (address: string) => void;
}

const NFTDeployment = ({ isMobile, onContractDeployed }: NFTDeploymentProps) => {
  return (
    <DeploymentProvider>
      <NFTDeploymentContent isMobile={isMobile} onContractDeployed={onContractDeployed} />
    </DeploymentProvider>
  );
};

export default NFTDeployment;