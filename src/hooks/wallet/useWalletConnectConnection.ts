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
      
      // Find the WalletConnect connector first
      const walletConnectConnector = connectors.find(
        (connector) => connector.id === 'walletConnect'
      );

      if (!walletConnectConnector) {
        console.error("WalletConnect connector not found");
        throw new Error("WalletConnect connector not found");
      }

      // Set up a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection timed out")), 30000);
      });

      // Open modal and wait for connection with timeout
      console.log("Opening WalletConnect modal...");
      const connectionPromise = Promise.race([
        (async () => {
          await open();
          console.log("Modal opened, attempting connection...");
          
          // Add a small delay to ensure modal is fully rendered
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await connect({ connector: walletConnectConnector });
          
          // Wait for connection to be confirmed
          let attempts = 0;
          while (!isConnected && !address && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            console.log(`Waiting for connection... Attempt ${attempts}/10`);
          }
          
          if (!isConnected || !address) {
            throw new Error("Connection not established");
          }
          
          return address;
        })(),
        timeoutPromise
      ]);

      const connectedAddress = await connectionPromise;
      console.log("WalletConnect connection successful:", connectedAddress);
      
      // Check network after successful connection
      await ensureArbitrumNetwork();
      
      return [connectedAddress];
      
    } catch (error: any) {
      console.error("WalletConnect error:", error);
      
      // Only show error toast for actual errors, not user cancellations
      if (error.message !== "User rejected the request." && 
          !error.message?.includes("User closed modal")) {
        toast({
          title: "Connection Failed",
          description: error.message === "Connection timed out" 
            ? "Connection attempt timed out. Please try again."
            : "Failed to connect with WalletConnect. Please try again.",
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