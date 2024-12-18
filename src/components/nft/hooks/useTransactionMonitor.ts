import { useEffect } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { handlePendingTransaction } from "@/utils/pendingTransactionHandler";
import { useDeploymentContext } from "../context/DeploymentContext";

export const useTransactionMonitor = () => {
  const { toast } = useToast();
  const {
    setPendingTx,
    setTransactionHash,
    setErrorMessage,
  } = useDeploymentContext();

  const monitorTransaction = async (provider: ethers.providers.Web3Provider, txHash: string) => {
    try {
      await handlePendingTransaction(txHash, provider, {
        onSuccess: () => {
          setPendingTx("");
          setTransactionHash("");
          toast({
            title: "Transaction Completed",
            description: "The pending transaction has been confirmed.",
          });
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
          setErrorMessage("Transaction failed: " + error.message);
          toast({
            title: "Transaction Failed",
            description: "The pending transaction has failed. You can try canceling it.",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error("Error monitoring transaction:", error);
    }
  };

  return { monitorTransaction };
};