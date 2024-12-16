import { Button } from "@/components/ui/button";
import { Cog } from "lucide-react";

interface DeploymentButtonProps {
    isDeploying: boolean;
    onClick: () => void;
}

const DeploymentButton = ({ isDeploying, onClick }: DeploymentButtonProps) => {
    return (
        <Button
            onClick={onClick}
            disabled={isDeploying}
            className="w-full mb-4"
        >
            {isDeploying ? (
                <>
                    <Cog className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                </>
            ) : (
                "Deploy DMC Token"
            )}
        </Button>
    );
};

export default DeploymentButton;