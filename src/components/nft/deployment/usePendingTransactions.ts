import { useEffect } from "react";
import { ethers } from "ethers";
import { useDeploymentContext } from "./DeploymentProvider";
import { useTransactionMonitor } from "../hooks/useTransactionMonitor";

export const usePendingTransactions = () => {
  const { monitorTransaction } = useTransactionMonitor();
  const { setPendingTx, setTransactionHash } = useDeploymentContext();

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
};