import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deployCleopatraNFT } from "@/scripts/deployCleopatraNFT";
import { useState } from "react";
import { ethers } from "ethers";
import { Copy } from "lucide-react";

const NFTDeployment = () => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [contractAddress, setContractAddress] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { toast } = useToast();

    const handleDeploy = async () => {
        setErrorMessage(""); // Clear previous error
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

            setIsDeploying(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Ensure we're on Arbitrum One
            const network = await provider.getNetwork();
            console.log("Connected to network:", network.name);
            
            if (network.chainId !== 42161) { // Arbitrum One chainId
                toast({
                    title: "Wrong Network",
                    description: "Please switch to Arbitrum One network",
                    variant: "destructive",
                });
                return;
            }
            
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            console.log("Connected with address:", address);
            
            console.log("Initializing contract deployment...");
            const contract = await deployCleopatraNFT(signer);
            
            console.log("Contract deployment successful");
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

    const copyError = () => {
        navigator.clipboard.writeText(errorMessage);
        toast({
            title: "Copied",
            description: "Error message copied to clipboard",
        });
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

            {errorMessage && (
                <div className="mt-4 p-4 bg-red-900/20 rounded-lg">
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-red-400 break-all select-text">
                            {errorMessage}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyError}
                            className="shrink-0"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFTDeployment;