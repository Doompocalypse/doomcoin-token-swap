import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { useDeploymentContext } from "../deployment/DeploymentProvider";

const PendingTransactionHandler = () => {
  const { toast } = useToast();
  const { pendingTx, setPendingTx, setTransactionHash, setErrorMessage } = useDeploymentContext();

  const cancelPendingTransaction = async () => {
    if (!window.ethereum || !pendingTx) return;
    
    try {
      console.log("Attempting to cancel transaction:", pendingTx);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: await signer.getAddress(),
        value: 0,
        nonce: await provider.getTransactionCount(await signer.getAddress(), "pending"),
        gasPrice: (await provider.getGasPrice()).mul(2),
        gasLimit: 21000,
      });
      
      console.log("Cancellation transaction submitted:", tx.hash);
      await tx.wait();
      
      toast({
        title: "Transaction Cancelled",
        description: "Previous pending transaction has been cancelled.",
      });
      
      setPendingTx("");
      setTransactionHash("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the pending transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!pendingTx) return null;

  return (
    <div className="p-4 bg-yellow-900/20 rounded-lg space-y-4">
      <p className="text-yellow-400">
        There is a pending transaction that needs to be cancelled before deploying a new contract.
      </p>
      <Button
        onClick={cancelPendingTransaction}
        variant="outline"
        className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
      >
        Cancel Pending Transaction
      </Button>
    </div>
  );
};

export default PendingTransactionHandler;
