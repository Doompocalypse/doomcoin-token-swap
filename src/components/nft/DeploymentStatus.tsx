import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DeploymentStatusProps {
    contractAddress: string;
    errorMessage: string;
}

const DeploymentStatus = ({ contractAddress, errorMessage }: DeploymentStatusProps) => {
    const { toast } = useToast();

    const copyError = () => {
        navigator.clipboard.writeText(errorMessage);
        toast({
            title: "Copied",
            description: "Error message copied to clipboard",
        });
    };

    const getEtherscanUrl = () => {
        // Using Sepolia network for verification
        return `https://sepolia.etherscan.io/address/${contractAddress}`;
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(contractAddress);
        toast({
            title: "Copied",
            description: "Contract address copied to clipboard",
        });
    };

    return (
        <>
            {contractAddress && (
                <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
                    <div className="flex flex-col gap-2">
                        <p className="text-green-400 break-all">
                            Contract deployed successfully at: {contractAddress}
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
                                onClick={() => window.open(getEtherscanUrl(), '_blank')}
                                className="text-green-400 border-green-400 hover:bg-green-400/20"
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on Etherscan
                            </Button>
                        </div>
                    </div>
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
        </>
    );
};

export default DeploymentStatus;