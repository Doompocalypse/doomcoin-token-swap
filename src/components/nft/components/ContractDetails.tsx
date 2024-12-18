import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import NFTCollectionImport from "../NFTCollectionImport";
import DeploymentVerification from "../DeploymentVerification";

interface ContractDetailsProps {
    contractAddress: string;
    transactionHash?: string;
}

const ContractDetails = ({ contractAddress, transactionHash }: ContractDetailsProps) => {
    const { toast } = useToast();

    const copyAddress = () => {
        navigator.clipboard.writeText(contractAddress);
        toast({
            title: "Copied",
            description: "Contract address copied to clipboard",
        });
    };

    const getEtherscanUrl = () => {
        return `https://sepolia.etherscan.io/address/${contractAddress}`;
    };

    return (
        <>
            <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
                <div className="flex flex-col gap-2">
                    <p className="text-green-400 break-all">
                        Contract deployed at: {contractAddress}
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
            <DeploymentVerification 
                contractAddress={contractAddress}
                transactionHash={transactionHash}
            />
            <NFTCollectionImport contractAddress={contractAddress} />
        </>
    );
};

export default ContractDetails;