import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTCollectionImport from "./NFTCollectionImport";

interface DeploymentStatusProps {
    contractAddress: string;
    errorMessage: string;
    transactionHash?: string;
}

const DeploymentStatus = ({ contractAddress, errorMessage, transactionHash }: DeploymentStatusProps) => {
    const { toast } = useToast();
    const [transactionStatus, setTransactionStatus] = useState<string>("");
    const [confirmations, setConfirmations] = useState<number>(0);

    useEffect(() => {
        const checkTransactionStatus = async () => {
            if (!transactionHash || !window.ethereum) return;

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const tx = await provider.getTransaction(transactionHash);
                
                if (!tx) {
                    console.log("Transaction not found:", transactionHash);
                    setTransactionStatus("Transaction not found");
                    return;
                }

                console.log("Transaction details:", {
                    hash: tx.hash,
                    blockNumber: tx.blockNumber,
                    confirmations: tx.confirmations,
                    from: tx.from,
                    to: tx.to,
                    value: tx.value.toString(),
                    gasPrice: tx.gasPrice?.toString(),
                    gasLimit: tx.gasLimit.toString()
                });

                if (!tx.blockNumber) {
                    setTransactionStatus("Pending - Waiting for confirmation");
                } else {
                    const receipt = await provider.getTransactionReceipt(transactionHash);
                    setConfirmations(receipt.confirmations);
                    
                    if (receipt.status === 1) {
                        setTransactionStatus("Confirmed");
                    } else {
                        setTransactionStatus("Failed");
                    }
                }
            } catch (error) {
                console.error("Error checking transaction status:", error);
                setTransactionStatus("Error checking status");
            }
        };

        const interval = setInterval(checkTransactionStatus, 5000); // Check every 5 seconds
        checkTransactionStatus(); // Initial check

        return () => clearInterval(interval);
    }, [transactionHash]);

    const copyError = () => {
        navigator.clipboard.writeText(errorMessage);
        toast({
            title: "Copied",
            description: "Error message copied to clipboard",
        });
    };

    const getEtherscanUrl = (hash?: string) => {
        // Using Sepolia network for verification
        if (hash) {
            return `https://sepolia.etherscan.io/tx/${hash}`;
        }
        return `https://sepolia.etherscan.io/address/${contractAddress}`;
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(contractAddress);
        toast({
            title: "Copied",
            description: "Contract address copied to clipboard",
        });
    };

    const copyTransactionHash = () => {
        if (transactionHash) {
            navigator.clipboard.writeText(transactionHash);
            toast({
                title: "Copied",
                description: "Transaction hash copied to clipboard",
            });
        }
    };

    return (
        <>
            {transactionHash && !contractAddress && !errorMessage && (
                <div className="mt-4 p-4 bg-blue-900/20 rounded-lg space-y-2">
                    <div className="flex flex-col gap-2">
                        <p className="text-blue-400 break-all">
                            Transaction Hash: {transactionHash}
                        </p>
                        <p className="text-blue-300">
                            Status: {transactionStatus}
                            {confirmations > 0 && ` (${confirmations} confirmations)`}
                        </p>
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
                                onClick={() => window.open(getEtherscanUrl(transactionHash), '_blank')}
                                className="text-blue-400 border-blue-400 hover:bg-blue-400/20"
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on Etherscan
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {contractAddress && (
                <>
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
                    <NFTCollectionImport contractAddress={contractAddress} />
                </>
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