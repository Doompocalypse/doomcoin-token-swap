import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { deployDMCToken } from "@/scripts/deployDMCToken";
import { Cog } from "lucide-react";

interface DeploymentFormProps {
    onSuccess: (address: string) => void;
    onError: (message: string) => void;
}

const DeploymentForm = ({ onSuccess, onError }: DeploymentFormProps) => {
    const [isDeploying, setIsDeploying] = useState(false);
    const { toast } = useToast();

    const handleDeploy = async () => {
        if (!window.ethereum) {
            toast({
                title: "Error",
                description: "Please install MetaMask to deploy the contract",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsDeploying(true);
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const network = await provider.getNetwork();
            console.log("Connected to network:", network);
            
            if (network.chainId !== 11155111) { // Sepolia
                toast({
                    title: "Wrong Network",
                    description: "Please switch to Sepolia network",
                    variant: "destructive",
                });
                return;
            }

            console.log("Starting token deployment...");
            const contract = await deployDMCToken(signer);
            console.log("Token deployed at:", contract.address);
            
            onSuccess(contract.address);
            
            toast({
                title: "Success",
                description: `DMC Token deployed at ${contract.address}`,
            });
            
        } catch (error: any) {
            console.error("Error deploying DMC token:", error);
            const errorMsg = error?.message || "Failed to deploy DMC token";
            onError(errorMsg);
            toast({
                title: "Error",
                description: errorMsg,
                variant: "destructive",
            });
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <Button
            onClick={handleDeploy}
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

export default DeploymentForm;