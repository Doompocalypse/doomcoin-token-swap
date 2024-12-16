import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deployCleopatraNFT } from "@/scripts/deployCleopatraNFT";
import { useState } from "react";
import { ethers } from "ethers";
import { SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";
import GasEstimator from "./GasEstimator";
import DeploymentStatus from "./DeploymentStatus";
import CollectionInfo from "./CollectionInfo";

const NFTDeployment = () => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [contractAddress, setContractAddress] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { toast } = useToast();

    const handleDeploy = async () => {
        setErrorMessage("");
        if (!window.ethereum) {
            toast({
                title: "Error",
                description: "Please install MetaMask to deploy the contract",
                variant: "destructive",
            });
            return;
        }

        try {
            console.log("Requesting wallet connection...");
            await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            const network = await provider.getNetwork();
            console.log("Connected to network:", network.name);
            
            const isValidNetwork = network.chainId === 421613 || 
                                 network.chainId === parseInt(SEPOLIA_CHAIN_ID, 16);
            
            if (!isValidNetwork) {
                toast({
                    title: "Wrong Network",
                    description: "Please switch to either Sepolia (for testing) or Arbitrum One network",
                    variant: "destructive",
                });
                return;
            }

            const signer = provider.getSigner();
            setIsDeploying(true);
            console.log("Initializing contract deployment...");
            const contract = await deployCleopatraNFT(signer);
            
            console.log("Contract deployment successful");
            setContractAddress(contract.address);
            
            toast({
                title: "Success",
                description: `NFT Collection deployed at ${contract.address} on ${network.name}`,
            });
        } catch (error) {
            console.error("Deployment error:", error);
            const errorMsg = error instanceof Error ? error.message : "Failed to deploy contract. Check console for details.";
            setErrorMessage(errorMsg);
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
        <div className="space-y-6 p-6 bg-black/40 rounded-lg">
            <CollectionInfo />
            <GasEstimator onEstimateComplete={() => {}} />
            <Button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="w-full"
            >
                {isDeploying ? "Deploying..." : "Deploy Contract"}
            </Button>
            <DeploymentStatus 
                contractAddress={contractAddress}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default NFTDeployment;