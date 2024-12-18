import { useEffect } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { isContractDeployed, verifyContractBytecode } from "@/utils/contractVerification";
import GasEstimator from "./GasEstimator";
import DeploymentStatus from "./DeploymentStatus";
import CollectionInfo from "./CollectionInfo";
import { DeploymentProvider, useDeploymentContext } from "./context/DeploymentContext";
import PendingTransactionHandler from "./components/PendingTransactionHandler";
import DeploymentForm from "./components/DeploymentForm";
import { useTransactionMonitor } from "./hooks/useTransactionMonitor";

const KNOWN_DEPLOYMENT = "0xce4cd90711fedba2634a794aebcacae15c6925b3cb46d60f4da1f476706722da";

const NFTDeploymentContent = ({ isMobile }: { isMobile: boolean }) => {
  const { toast } = useToast();
  const { monitorTransaction } = useTransactionMonitor();
  const {
    contractAddress,
    errorMessage,
    transactionHash,
    setIsAlreadyDeployed,
    setContractAddress,
    setTransactionHash,
    setPendingTx,
    estimatedGasCost,
    setEstimatedGasCost,
  } = useDeploymentContext();

  // Check for existing deployment
  useEffect(() => {
    const checkExistingDeployment = async () => {
      if (!window.ethereum) return;
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const receipt = await provider.getTransactionReceipt(KNOWN_DEPLOYMENT);
        
        if (receipt && receipt.contractAddress) {
          console.log("Found existing deployment at:", receipt.contractAddress);
          const isDeployed = await isContractDeployed(provider, receipt.contractAddress);
          const isValid = await verifyContractBytecode(receipt.contractAddress, provider);
          
          if (isDeployed && isValid) {
            setIsAlreadyDeployed(true);
            setContractAddress(receipt.contractAddress);
            setTransactionHash(KNOWN_DEPLOYMENT);
            toast({
              title: "Contract Already Deployed",
              description: "The NFT contract has already been deployed successfully.",
            });
          }
        }
      } catch (error) {
        console.error("Error checking existing deployment:", error);
      }
    };

    checkExistingDeployment();
  }, [toast, setIsAlreadyDeployed, setContractAddress, setTransactionHash]);

  // Check for pending transactions
  useEffect(() => {
    const checkPendingTransactions = async () => {
      if (!window.ethereum) return;
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length === 0) return;
        
        const nonce = await provider.getTransactionCount(accounts[0], "pending");
        const latestNonce = await provider.getTransactionCount(accounts[0], "latest");
        
        if (nonce > latestNonce) {
          console.log("Pending transaction detected");
          const pendingTxs = await provider.send("eth_getBlockByNumber", ["pending", true]);
          const userPendingTx = pendingTxs.transactions.find(
            (tx: any) => tx.from.toLowerCase() === accounts[0].toLowerCase()
          );
          
          if (userPendingTx) {
            console.log("Found pending transaction:", userPendingTx.hash);
            setPendingTx(userPendingTx.hash);
            setTransactionHash(userPendingTx.hash);
            
            // Monitor the pending transaction
            await monitorTransaction(provider, userPendingTx.hash);
          }
        }
      } catch (error) {
        console.error("Error checking pending transactions:", error);
      }
    };

    checkPendingTransactions();
    const interval = setInterval(checkPendingTransactions, 30000);
    return () => clearInterval(interval);
  }, [setPendingTx, setTransactionHash, monitorTransaction]);

  return (
    <div className="space-y-6 p-6 bg-black/40 rounded-lg">
      <CollectionInfo />
      <GasEstimator onEstimateComplete={setEstimatedGasCost} />
      <PendingTransactionHandler />
      <DeploymentForm isMobile={isMobile} />
      <DeploymentStatus 
        contractAddress={contractAddress}
        errorMessage={errorMessage}
        transactionHash={transactionHash}
      />
    </div>
  );
};

const NFTDeployment = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <DeploymentProvider>
      <NFTDeploymentContent isMobile={isMobile} />
    </DeploymentProvider>
  );
};

export default NFTDeployment;