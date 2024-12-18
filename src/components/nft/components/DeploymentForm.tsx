import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deployCleopatraNFT } from "@/scripts/deployCleopatraNFT";
import { ethers } from "ethers";
import { useDeploymentContext } from "../deployment/DeploymentProvider";
import { useNetworkValidation } from "../hooks/useNetworkValidation";

interface DeploymentFormProps {
  isMobile: boolean;
}

const DeploymentForm = ({ isMobile }: DeploymentFormProps) => {
  const { toast } = useToast();
  const { validateNetwork } = useNetworkValidation();
  const {
    isDeploying,
    setIsDeploying,
    setContractAddress,
    setTransactionHash,
    setErrorMessage,
    estimatedGasCost,
    pendingTx,
    isAlreadyDeployed,
  } = useDeploymentContext();

  const handleDeploy = async () => {
    if (isAlreadyDeployed) {
      toast({
        title: "Contract Already Deployed",
        description: "The NFT contract has already been deployed. You can't deploy it again.",
        variant: "destructive",
      });
      return;
    }

    setErrorMessage("");
    setTransactionHash("");
    
    if (!window.ethereum) {
      toast({
        title: "Error",
        description: "Please install MetaMask to deploy the contract",
        variant: "destructive",
      });
      return;
    }

    if (pendingTx) {
      toast({
        title: "Pending Transaction",
        description: "Please cancel the pending transaction before deploying a new one.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Requesting wallet connection...");
      await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const isValidNetwork = await validateNetwork(provider);
      
      if (!isValidNetwork) return;

      if (!estimatedGasCost) {
        toast({
          title: "Error",
          description: "Please wait for gas estimation to complete",
          variant: "destructive",
        });
        return;
      }

      const signer = provider.getSigner();
      setIsDeploying(true);
      console.log("Initializing NFT contract deployment...");
      
      // Get current gas price
      const gasPrice = await provider.getGasPrice();
      console.log("Current gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
      
      // Add 20% to ensure transaction goes through
      const adjustedGasPrice = gasPrice.mul(120).div(100);
      console.log("Adjusted gas price:", ethers.utils.formatUnits(adjustedGasPrice, "gwei"), "gwei");

      const contract = await deployCleopatraNFT(signer);
      
      console.log("Contract deployment initiated with transaction hash:", contract.deployTransaction.hash);
      setTransactionHash(contract.deployTransaction.hash);
      
      toast({
        title: "Deployment Started",
        description: "Please wait while your transaction is being processed. Do not close this window.",
      });

      console.log("Waiting for transaction confirmation...");
      
      // Monitor transaction status
      const receipt = await contract.deployTransaction.wait();
      
      if (receipt.status === 0) {
        throw new Error("Transaction failed - Please check Etherscan for details");
      }
      
      console.log("NFT Contract deployment successful");
      setContractAddress(contract.address);
      
      toast({
        title: "Success",
        description: `NFT Collection deployed at ${contract.address}`,
      });
    } catch (error: any) {
      console.error("Deployment error:", error);
      
      // Check if the error is due to user rejection
      if (error.code === 4001) {
        setErrorMessage("Transaction was rejected by user");
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction. No funds were spent.",
          variant: "destructive",
        });
        return;
      }
      
      // Check for out of gas error
      if (error.code === -32000) {
        setErrorMessage("Transaction failed - Insufficient gas. Please try again with higher gas limit");
        toast({
          title: "Transaction Failed",
          description: "Transaction failed due to insufficient gas. Please try again with higher gas limit.",
          variant: "destructive",
        });
        return;
      }
      
      const errorMsg = error instanceof Error ? error.message : "Failed to deploy contract. Check console for details.";
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <>
      {isAlreadyDeployed ? (
        <div className="p-4 bg-yellow-900/20 rounded-lg">
          <p className="text-yellow-400">
            This NFT contract has already been deployed. You can view its details below.
          </p>
        </div>
      ) : (
        <Button
          onClick={handleDeploy}
          disabled={isDeploying || !estimatedGasCost || !!pendingTx}
          className="w-full"
        >
          {isDeploying ? "Deploying..." : "Deploy NFT Contract"}
        </Button>
      )}
    </>
  );
};

export default DeploymentForm;