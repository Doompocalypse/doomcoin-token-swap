import VideoBackground from "@/components/VideoBackground";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeploymentHeader from "@/components/token/DeploymentHeader";

const DMC_TOKEN_ADDRESS = "0x02655Ad2a81e396Bc35957d647179fD87b3d2b36";

const DMCTokenDeployment = () => {
    const { toast } = useToast();

    const copyAddress = () => {
        navigator.clipboard.writeText(DMC_TOKEN_ADDRESS);
        toast({
            title: "Copied",
            description: "Contract address copied to clipboard",
        });
    };

    const openEtherscan = () => {
        window.open(`https://sepolia.etherscan.io/address/${DMC_TOKEN_ADDRESS}`, '_blank');
    };

    return (
        <div className="relative min-h-screen">
            <VideoBackground />
            <div className="relative z-10 container mx-auto px-4 py-8">
                <DeploymentHeader />
                <div className="max-w-2xl mx-auto bg-black/40 p-6 rounded-lg">
                    <h1 className="text-2xl font-bold text-white mb-4">DMC Token Contract</h1>
                    <p className="text-gray-300 mb-6">
                        The DMC token has already been deployed on the Sepolia network.
                        You can view the contract details below.
                    </p>
                    <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
                        <div className="flex flex-col gap-2">
                            <p className="text-green-400 break-all">
                                Contract Address: {DMC_TOKEN_ADDRESS}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyAddress}
                                    className="text-green-400 border-green-400 hover:bg-green-400/20"
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Address
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={openEtherscan}
                                    className="text-green-400 border-green-400 hover:bg-green-400/20"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View on Etherscan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DMCTokenDeployment;