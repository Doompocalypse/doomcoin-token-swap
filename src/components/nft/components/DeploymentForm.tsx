import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deployCleopatraNFT } from "@/scripts/deployCleopatraNFT";
import { ethers } from "ethers";
import { useDeploymentContext } from "../context/DeploymentContext";
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
      const contract = await deployCleopatraNFT(signer);
      
      console.log("Contract deployment initiated with transaction hash:", contract.deployTransaction.hash);
      setTransactionHash(contract.deployTransaction.hash);
      
      toast({
        title: "Deployment Started",
        description: "Please wait while your transaction is being processed...",
      });

      console.log("Waiting for transaction confirmation...");
      await contract.deployed();
      
      console.log("NFT Contract deployment successful");
      setContractAddress(contract.address);
      
      toast({
        title: "Success",
        description: `NFT Collection deployed at ${contract.address}`,
      });
    } catch (error) {
      console.error("Deployment error:", error);
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