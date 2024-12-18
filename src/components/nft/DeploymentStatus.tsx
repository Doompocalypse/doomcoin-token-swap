import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import TransactionDetails from "./components/TransactionDetails";
import ContractDetails from "./components/ContractDetails";
import ErrorDisplay from "./components/ErrorDisplay";

interface DeploymentStatusProps {
    contractAddress: string;
    errorMessage: string;
    transactionHash?: string;
}

const DeploymentStatus = ({ 
    contractAddress, 
    errorMessage, 
    transactionHash 
}: DeploymentStatusProps) => {
    const { toast } = useToast();
    const [transactionStatus, setTransactionStatus] = useState<string>("");
    const [confirmations, setConfirmations] = useState<number>(0);
    const [failureReason, setFailureReason] = useState<string>("");

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
                        try {
                            const code = await provider.call(tx, tx.blockNumber);
                            const reason = ethers.utils.toUtf8String("0x" + code.slice(138));
                            setFailureReason(reason);
                            console.error("Transaction failed reason:", reason);
                            
                            toast({
                                title: "Transaction Failed",
                                description: `Your transaction failed: ${reason}. Please check Etherscan for more details.`,
                                variant: "destructive",
                            });
                        } catch (error) {
                            console.error("Error getting failure reason:", error);
                            setFailureReason("Unknown error - Please check Etherscan for details");
                            
                            toast({
                                title: "Transaction Failed",
                                description: "Your transaction failed. Please check Etherscan for more details.",
                                variant: "destructive",
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking transaction status:", error);
                setTransactionStatus("Error checking status");
            }
        };

        const interval = setInterval(checkTransactionStatus, 5000);
        checkTransactionStatus();

        return () => clearInterval(interval);
    }, [transactionHash, toast]);

    return (
        <>
            {transactionHash && !contractAddress && !errorMessage && (
                <TransactionDetails
                    transactionHash={transactionHash}
                    status={transactionStatus}
                    confirmations={confirmations}
                    failureReason={failureReason}
                />
            )}

            {contractAddress && (
                <ContractDetails
                    contractAddress={contractAddress}
                    transactionHash={transactionHash}
                />
            )}

            {errorMessage && (
                <ErrorDisplay errorMessage={errorMessage} />
            )}
        </>
    );
};

export default DeploymentStatus;