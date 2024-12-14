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
      
      // Find the WalletConnect connector
      const walletConnectConnector = connectors.find(
        (connector) => connector.id === 'walletConnect'
      );

      if (!walletConnectConnector) {
        throw new Error("WalletConnect connector not found");
      }

      // First, open the WalletConnect modal
      await open();
      
      // Connect using the WalletConnect connector
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
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect with WalletConnect",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    connectWalletConnect,
  };
};