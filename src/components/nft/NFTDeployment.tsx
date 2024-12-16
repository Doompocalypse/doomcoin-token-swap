import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deployCleopatraNFT } from "@/scripts/deployCleopatraNFT";
import { useState } from "react";
import { ethers } from "ethers";
import { Copy } from "lucide-react";
import { SEPOLIA_CHAIN_ID } from "@/utils/chainConfig";

const NFTDeployment = () => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [contractAddress, setContractAddress] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [estimatedGas, setEstimatedGas] = useState<string>("");
    const { toast } = useToast();

    const estimateGasPrice = async (provider: ethers.providers.Web3Provider) => {
        try {
            const feeData = await provider.getFeeData();
            const gasPrice = feeData.gasPrice;
            if (!gasPrice) throw new Error("Could not get gas price");
            
            // Estimate deployment gas (approximate)
            const estimatedGasUnits = 3000000; // Base estimate for NFT contract deployment
            const totalGasCost = gasPrice.mul(estimatedGasUnits);
            
            // Convert to ETH for display
            const gasCostInEth = ethers.utils.formatEther(totalGasCost);
            setEstimatedGas(gasCostInEth);
            
            return totalGasCost;
        } catch (error) {
            console.error("Error estimating gas:", error);
            throw error;
        }
    };

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

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Get network info
            const network = await provider.getNetwork();
            console.log("Connected to network:", network.name);
            
            // Allow both Sepolia and Arbitrum One
            const isValidNetwork = network.chainId === 421613 || // Arbitrum One
                                 network.chainId === parseInt(SEPOLIA_CHAIN_ID, 16); // Sepolia
            
            if (!isValidNetwork) {
                toast({
                    title: "Wrong Network",
                    description: "Please switch to either Sepolia (for testing) or Arbitrum One network",
                    variant: "destructive",
                });
                return;
            }

            // Check balance before deployment
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            const estimatedCost = await estimateGasPrice(provider);

            if (balance.lt(estimatedCost)) {
                const required = ethers.utils.formatEther(estimatedCost);
                throw new Error(`Insufficient gas. You need approximately ${required} ETH for gas fees. Please add funds to your wallet.`);
            }

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
                    Deploy a new NFT collection on Sepolia (test) or Arbitrum One with the following specifications:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>6 unique Cleopatra's Necklace NFTs</li>
                    <li>Price: 10,000 DMC per NFT</li>
                    <li>10% royalty on secondary sales</li>
                    <li>Exclusive DMC payment support</li>
                </ul>
            </div>
            
            {estimatedGas && (
                <div className="p-4 bg-blue-900/20 rounded-lg">
                    <p className="text-blue-400">
                        Estimated gas cost: {estimatedGas} ETH
                    </p>
                </div>
            )}
            
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