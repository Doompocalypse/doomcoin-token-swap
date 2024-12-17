import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { deployContract, verifyDeployment } from "@/scripts/deployDMCToken";

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
            const contract = await deployContract(signer);
            
            // Wait for the transaction to be mined and get the receipt
            console.log("Waiting for transaction confirmation...");
            const receipt = await contract.deployTransaction.wait();
            
            if (receipt.status === 0) {
                throw new Error("Contract deployment failed during execution. This might be due to insufficient gas or contract initialization error.");
            }

            // Verify the deployment
            await verifyDeployment(contract, signer);
            
            console.log("Token deployed at:", contract.address);
            onSuccess(contract.address);
            
            toast({
                title: "Success",
                description: `DMC Token deployed at ${contract.address}`,
            });
            
        } catch (error: any) {
            console.error("Error deploying DMC token:", error);
            
            // Handle user rejection
            if (error.code === "ACTION_REJECTED") {
                const message = "Transaction was rejected in MetaMask. Please try again and confirm the transaction.";
                onError(message);
                toast({
                    title: "Transaction Rejected",
                    description: message,
                    variant: "destructive",
                });
                return;
            }
            
            // Handle failed transactions
            if (error.code === "CALL_EXCEPTION") {
                const message = "Transaction failed during execution. This might be due to insufficient gas or contract initialization error. Please try again with higher gas limit.";
                onError(message);
                toast({
                    title: "Transaction Failed",
                    description: message,
                    variant: "destructive",
                });
                return;
            }
            
            // Handle other errors
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