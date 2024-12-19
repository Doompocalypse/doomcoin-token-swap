import VideoBackground from "@/components/VideoBackground";
import { useState, useEffect } from "react";
import DeploymentHeader from "@/components/nft/components/DeploymentHeader";
import DeploymentContent from "@/components/nft/components/DeploymentContent";
import { useIsMobile } from "@/hooks/use-mobile";

const STORAGE_KEY = "nft_deployment_status";

const DMCTokenDeployment = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectedAccount, setConnectedAccount] = useState<string>();
    const [contractAddress, setContractAddress] = useState<string>();
    const isMobile = useIsMobile();

    // Load existing deployment on mount
    useEffect(() => {
        const savedStatus = localStorage.getItem(STORAGE_KEY);
        if (savedStatus) {
            const { contractAddress: savedAddress } = JSON.parse(savedStatus);
            console.log("Found saved contract address:", savedAddress);
            if (savedAddress) {
                setContractAddress(savedAddress);
            }
        }
    }, []);

    const handleConnect = (connected: boolean, account?: string) => {
        console.log("Wallet connection status:", connected, "Account:", account);
        setIsConnected(connected);
        setConnectedAccount(account);
    };

    const handleContractDeployed = (address: string) => {
        console.log("Contract deployed at:", address);
        setContractAddress(address);
    };

    return (
        <div className="relative min-h-screen">
            <VideoBackground />
            <DeploymentHeader onConnect={handleConnect} />
            <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
                <div className="max-w-6xl mx-auto space-y-8">
                    <DeploymentContent 
                        isConnected={isConnected}
                        connectedAccount={connectedAccount}
                        contractAddress={contractAddress}
                        isMobile={isMobile}
                        onContractDeployed={handleContractDeployed}
                    />
                </div>
            </div>
        </div>
    );
};

export default DMCTokenDeployment;