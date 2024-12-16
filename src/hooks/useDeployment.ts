import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { deployDMCToken } from "@/scripts/deployDMCToken";

interface UseDeploymentProps {
    onSuccess: (address: string) => void;
    onError: (message: string) => void;
}

export const useDeployment = ({ onSuccess, onError }: UseDeploymentProps) => {
    const [isDeploying, setIsDeploying] = useState(false);
    const { toast } = useToast();

    const handleDeploy = async () => {
        console.log("Starting deployment process in useDeployment hook...");
        
        if (!window.ethereum) {
            console.error("MetaMask not detected");
            toast({
                title: "Error",
                description: "Please install MetaMask to deploy the contract",
                variant: "destructive",
            });
            return;
        }

        try {
            console.log("Setting deployment state...");
            setIsDeploying(true);
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const network = await provider.getNetwork();
            console.log("Connected to network:", network);
            
            if (network.chainId !== 11155111) { // Sepolia
                console.error("Wrong network detected:", network.chainId);
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

    return {
        isDeploying,
        handleDeploy
    };
};