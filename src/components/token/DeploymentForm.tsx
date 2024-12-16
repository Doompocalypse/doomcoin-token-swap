import DeploymentButton from "./DeploymentButton";
import { useDeployment } from "@/hooks/useDeployment";

interface DeploymentFormProps {
    onSuccess: (address: string) => void;
    onError: (message: string) => void;
}

const DeploymentForm = ({ onSuccess, onError }: DeploymentFormProps) => {
    const { isDeploying, handleDeploy } = useDeployment({ onSuccess, onError });

    return (
        <DeploymentButton 
            isDeploying={isDeploying} 
            onClick={handleDeploy}
        />
    );
};

export default DeploymentForm;