import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import VideoBackground from "@/components/VideoBackground";
import DeploymentForm from "@/components/token/DeploymentForm";
import DeploymentStatus from "@/components/token/DeploymentStatus";
import DeploymentHeader from "@/components/token/DeploymentHeader";

const DMCTokenDeployment = () => {
    const [contractAddress, setContractAddress] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { toast } = useToast();

    const copyError = () => {
        if (errorMessage) {
            navigator.clipboard.writeText(errorMessage);
            toast({
                title: "Copied",
                description: "Error message copied to clipboard",
            });
        }
    };

    return (
        <div className="relative min-h-screen">
            <VideoBackground />
            <div className="relative z-10 container mx-auto px-4 py-8">
                <DeploymentHeader />
                <div className="max-w-2xl mx-auto bg-black/40 p-6 rounded-lg">
                    <h1 className="text-2xl font-bold text-white mb-4">Deploy DMC Token</h1>
                    <p className="text-gray-300 mb-6">
                        This will deploy the DMC token contract to the Sepolia network.
                        Make sure you have enough Sepolia ETH for deployment.
                    </p>
                    <DeploymentForm 
                        onSuccess={setContractAddress}
                        onError={setErrorMessage}
                    />
                    <DeploymentStatus 
                        contractAddress={contractAddress}
                        errorMessage={errorMessage}
                        onCopyError={copyError}
                    />
                </div>
            </div>
        </div>
    );
};

export default DMCTokenDeployment;