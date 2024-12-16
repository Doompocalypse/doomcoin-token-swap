import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import WalletConnect from "@/components/WalletConnect";
import { deployDMCToken } from "@/scripts/deployDMCToken";
import VideoBackground from "@/components/VideoBackground";

const DMCTokenDeployment = () => {
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
            setIsDeploying(true);
            
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

            const contract = await deployDMCToken(signer);
            setContractAddress(contract.address);
            
            toast({
                title: "Success",
                description: `DMC Token deployed at ${contract.address}`,
            });
            
        } catch (error) {
            console.error("Deployment error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to deploy DMC token",
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
                </div>
            </div>
        </div>
    );
};

export default DMCTokenDeployment;