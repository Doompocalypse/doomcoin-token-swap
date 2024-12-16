import DeploymentButton from "./DeploymentButton";
import { useDeployment } from "@/hooks/useDeployment";

interface DeploymentFormProps {
    onSuccess: (address: string) => void;
    onError: (message: string) => void;
}

const DeploymentForm = ({ onSuccess, onError }: DeploymentFormProps) => {
    const { isDeploying, handleDeploy } = useDeployment({ onSuccess, onError });

    const handleDeployClick = async () => {
        console.log("Deploy button clicked, starting deployment process...");
        try {
            await handleDeploy();
        } catch (error) {
            console.error("Deployment failed in form component:", error);
        }
    };

    return (
        <DeploymentButton 
            isDeploying={isDeploying} 
            onClick={handleDeployClick}
        />
    );
};

export default DeploymentForm;