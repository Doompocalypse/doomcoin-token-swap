import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deployCleopatraNFT } from "@/scripts/deployCleopatraNFT";
import { useState } from "react";
import { ethers } from "ethers";

const NFTDeployment = () => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [contractAddress, setContractAddress] = useState<string>("");
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
            // First request wallet connection
            console.log("Requesting wallet connection...");
            await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            setIsDeploying(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Ensure we're on the correct network before proceeding
            const network = await provider.getNetwork();
            console.log("Connected to network:", network.name);
            
            const signer = provider.getSigner();
            
            // Get the connected account
            const address = await signer.getAddress();
            console.log("Connected with address:", address);
            
            // Initialize contract deployment
            console.log("Initializing contract deployment...");
            const contract = await deployCleopatraNFT(signer);
            
            console.log("Contract deployment successful");
            setContractAddress(contract.address);
            
            toast({
                title: "Success",
                description: `Contract deployed at ${contract.address}`,
            });
        } catch (error) {
            console.error("Deployment error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to deploy contract. Check console for details.",
                variant: "destructive",
            });
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="space-y-6 p-6 bg-black/40 rounded-lg">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Deploy Cleopatra's Necklace NFT Collection</h3>
                <p className="text-gray-400">
                    Deploy a new NFT collection on Arbitrum with the following specifications:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>6 unique Cleopatra's Necklace NFTs</li>
                    <li>Price: 10,000 DMC per NFT</li>
                    <li>10% royalty on secondary sales</li>
                    <li>Exclusive DMC payment support</li>
                </ul>
            </div>
            
            <Button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="w-full"
            >
                {isDeploying ? "Deploying..." : "Deploy Contract"}
            </Button>
            
            {contractAddress && (
                <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
                    <p className="text-green-400 break-all">
                        Contract deployed successfully at: {contractAddress}
                    </p>
                </div>
            )}
        </div>
    );
};

export default NFTDeployment;