import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";
import { verifyContractDeployment } from "@/utils/contractVerification";
import { useToast } from "@/components/ui/use-toast";

interface DeploymentVerificationProps {
  contractAddress: string;
  transactionHash?: string;
}

const DeploymentVerification = ({ contractAddress, transactionHash }: DeploymentVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const verifyContract = async () => {
    if (!window.ethereum) {
      toast({
        title: "Error",
        description: "MetaMask is required to verify the contract.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const verified = await verifyContractDeployment(contractAddress, provider);
      setIsVerified(verified);
      
      if (verified) {
        toast({
          title: "Verification Successful",
          description: "The contract has been successfully verified on the blockchain.",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (contractAddress) {
      verifyContract();
    }
  }, [contractAddress]);

  const getEtherscanUrl = () => {
    return `https://sepolia.etherscan.io/address/${contractAddress}`;
  };

  if (!contractAddress) return null;

  return (
    <div className="mt-4 p-4 bg-black/20 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contract Verification</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={verifyContract}
          disabled={isVerifying}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
          Verify Again
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        <p className={`${isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
          {isVerified 
            ? "✓ Contract verified on blockchain" 
            : "⚠️ Contract verification pending"}
        </p>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(getEtherscanUrl(), '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View on Etherscan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentVerification;