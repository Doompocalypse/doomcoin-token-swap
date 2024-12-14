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

  const connectWalletConnect = async (): Promise<string[]> => {
    try {
      console.log("Starting WalletConnect connection process...");
      
      const walletConnectConnector = connectors.find(
        (connector) => connector.id === 'walletConnect'
      );

      if (!walletConnectConnector) {
        console.error("WalletConnect connector not found");
        throw new Error("WalletConnect connector not found");
      }

      // Show connecting toast before opening modal
      toast({
        title: "Initiating Connection",
        description: "Opening WalletConnect...",
      });

      // First open the modal
      await open();
      console.log("WalletConnect modal opened");

      // Then attempt the connection
      toast({
        title: "Connecting",
        description: "Please approve the connection request in your wallet",
      });

      // Direct connection attempt
      await connect({ connector: walletConnectConnector });
      
      // Wait for connection to be established
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts && (!isConnected || !address)) {
        console.log(`Waiting for connection... Attempt ${attempts + 1}/${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!isConnected || !address) {
        throw new Error("Failed to establish connection");
      }

      console.log("WalletConnect connection successful:", address);

      // Check network after successful connection
      await ensureArbitrumNetwork();
      
      return [address];

    } catch (error: any) {
      console.error("WalletConnect error:", error);
      
      const errorMessage = error.message?.toLowerCase() || '';
      
      if (errorMessage.includes("failed to establish")) {
        toast({
          title: "Connection Failed",
          description: "Unable to establish connection. Please try again.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("user rejected") || 
                 errorMessage.includes("user closed")) {
        toast({
          title: "Connection Cancelled",
          description: "You cancelled the connection attempt.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("unauthorized")) {
        toast({
          title: "Connection Failed",
          description: "Unable to establish secure connection. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect. Please try again.",
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