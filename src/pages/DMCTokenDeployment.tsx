import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import WalletConnect from "@/components/WalletConnect";
import { deployDMCToken } from "@/scripts/deployDMCToken";
import VideoBackground from "@/components/VideoBackground";
import { Copy } from "lucide-react";

const DMCTokenDeployment = () => {
    const [isDeploying, setIsDeploying] = useState(false);
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
            setErrorMessage("");
            
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
            
            setContractAddress(contract.address);
            
            toast({
                title: "Success",
                description: `DMC Token deployed at ${contract.address}`,
            });
            
        } catch (error: any) {
            console.error("Error deploying DMC token:", error);
            const errorMsg = error?.message || "Failed to deploy DMC token";
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
        <div className="relative min-h-screen">
            <VideoBackground />
            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="flex justify-end mb-4">
                    <WalletConnect onConnect={() => {}} />
                </div>
                <div className="max-w-2xl mx-auto bg-black/40 p-6 rounded-lg">
                    <h1 className="text-2xl font-bold text-white mb-4">Deploy DMC Token</h1>
                    <p className="text-gray-300 mb-6">
                        This will deploy the DMC token contract to the Sepolia network.
                        Make sure you have enough Sepolia ETH for deployment.
                    </p>
                    <Button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="w-full mb-4"
                    >
                        {isDeploying ? "Deploying..." : "Deploy DMC Token"}
                    </Button>
                    {contractAddress && (
                        <div className="p-4 bg-green-900/20 rounded-lg">
                            <p className="text-green-400 break-all">
                                Contract deployed successfully at: {contractAddress}
                            </p>
                            <p className="text-sm text-green-300 mt-2">
                                Save this address for future use!
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
            </div>
        </div>
    );
};

export default DMCTokenDeployment;