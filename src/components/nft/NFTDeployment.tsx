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
    const [transactionHash, setTransactionHash] = useState<string>("");
    const [estimatedGasCost, setEstimatedGasCost] = useState<ethers.BigNumber>();
    const { toast } = useToast();

    const handleDeploy = async () => {
        setErrorMessage("");
        setTransactionHash("");
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
            console.log("Connected to network:", {
                name: network.name,
                chainId: network.chainId
            });
            
            const isValidNetwork = network.chainId === parseInt(SEPOLIA_CHAIN_ID, 16);
            
            if (!isValidNetwork) {
                toast({
                    title: "Wrong Network",
                    description: "Please switch to Sepolia network for testing",
                    variant: "destructive",
                });
                return;
            }

            if (!estimatedGasCost) {
                toast({
                    title: "Error",
                    description: "Please wait for gas estimation to complete",
                    variant: "destructive",
                });
                return;
            }

            const signer = provider.getSigner();
            setIsDeploying(true);
            console.log("Initializing NFT contract deployment...");
            const contract = await deployCleopatraNFT(signer);
            
            console.log("Contract deployment initiated with transaction hash:", contract.deployTransaction.hash);
            setTransactionHash(contract.deployTransaction.hash);
            
            toast({
                title: "Deployment Started",
                description: "Please wait while your transaction is being processed...",
            });

            console.log("Waiting for transaction confirmation...");
            await contract.deployed();
            
            console.log("NFT Contract deployment successful");
            setContractAddress(contract.address);
            
            toast({
                title: "Success",
                description: `NFT Collection deployed at ${contract.address}`,
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
            <GasEstimator onEstimateComplete={setEstimatedGasCost} />
            {transactionHash && (
                <div className="p-4 bg-blue-900/20 rounded-lg">
                    <p className="text-blue-400 break-all">
                        Transaction Hash: {transactionHash}
                    </p>
                    <p className="text-sm text-blue-300 mt-2">
                        Your transaction is being processed. This may take a few minutes...
                    </p>
                </div>
            )}
            <Button
                onClick={handleDeploy}
                disabled={isDeploying || !estimatedGasCost}
                className="w-full"
            >
                {isDeploying ? "Deploying..." : "Deploy NFT Contract"}
            </Button>
            <DeploymentStatus 
                contractAddress={contractAddress}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default NFTDeployment;