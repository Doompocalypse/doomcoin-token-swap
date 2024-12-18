import { ethers } from "ethers";

interface TransactionCallbacks {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const handlePendingTransaction = async (
    txHash: string,
    provider: ethers.providers.Provider,
    callbacks?: TransactionCallbacks
) => {
    try {
        console.log("Monitoring pending transaction:", txHash);
        
        // Wait for transaction confirmation
        const receipt = await provider.waitForTransaction(txHash, 1); // Wait for 1 confirmation
        
        console.log("Transaction receipt received:", receipt);
        
        if (receipt.status === 1) {
            console.log("Transaction successful");
            callbacks?.onSuccess?.();
        } else {
            console.error("Transaction failed");
            callbacks?.onError?.(new Error("Transaction failed"));
        }
    } catch (error) {
        console.error("Error monitoring transaction:", error);
        callbacks?.onError?.(error as Error);
    }
};