import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TransactionDetailsProps {
    transactionHash: string;
    status: string;
    confirmations: number;
    failureReason?: string;
}

const TransactionDetails = ({ 
    transactionHash, 
    status, 
    confirmations, 
    failureReason 
}: TransactionDetailsProps) => {
    const { toast } = useToast();

    const copyTransactionHash = () => {
        navigator.clipboard.writeText(transactionHash);
        toast({
            title: "Copied",
            description: "Transaction hash copied to clipboard",
        });
    };

    const copyFailureReason = () => {
        if (failureReason) {
            navigator.clipboard.writeText(failureReason);
            toast({
                title: "Copied",
                description: "Error message copied to clipboard",
            });
        }
    };

    const getEtherscanUrl = () => {
        return `https://sepolia.etherscan.io/tx/${transactionHash}`;
    };

    return (
        <div className="mt-4 p-4 bg-blue-900/20 rounded-lg space-y-2">
            <div className="flex flex-col gap-2">
                <p className="text-blue-400 break-all">
                    Transaction Hash: {transactionHash}
                </p>
                <p className="text-blue-300">
                    Status: {status}
                    {confirmations > 0 && ` (${confirmations} confirmations)`}
                </p>
                {status === "Failed" && failureReason && (
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-red-400">
                            Failure Reason: {failureReason}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyFailureReason}
                            className="shrink-0"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyTransactionHash}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400/20"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Hash
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getEtherscanUrl(), '_blank')}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400/20"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Etherscan
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;