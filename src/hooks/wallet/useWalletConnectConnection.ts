import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useConnect } from 'wagmi';
import { useToast } from "@/hooks/use-toast";
import { useNetworkSwitch } from "./useNetworkSwitch";

export const useWalletConnectConnection = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { toast } = useToast();
  const { ensureArbitrumNetwork } = useNetworkSwitch();

  const connectWalletConnect = async () => {
    try {
      console.log("Starting WalletConnect connection process...");
      
      // First, open the WalletConnect modal
      console.log("Opening WalletConnect modal...");
      await open();
      
      // Find the WalletConnect connector
      const walletConnectConnector = connectors.find(
        (connector) => connector.id === 'walletConnect'
      );

      if (!walletConnectConnector) {
        console.error("WalletConnect connector not found");
        throw new Error("WalletConnect connector not found");
      }

      // Add a small delay to ensure modal is fully open
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then attempt the connection
      console.log("Attempting WalletConnect connection...");
      await connect({ connector: walletConnectConnector });
      
      // Wait for connection to be established
      if (isConnected && address) {
        console.log("WalletConnect connection successful:", address);
        
        // Check if we need to switch networks
        await ensureArbitrumNetwork();
        
        return [address];
      }
      
      throw new Error("Connection failed");
    } catch (error: any) {
      console.error("WalletConnect error:", error);
      // Only show toast for actual errors, not user cancellations
      if (error.message !== "User rejected the request.") {
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to connect with WalletConnect",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  return {
    connectWalletConnect,
  };
};