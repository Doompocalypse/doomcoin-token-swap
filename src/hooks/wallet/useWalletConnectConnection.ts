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

      // Increased timeout to 20 seconds for slower connections
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          console.log("Connection attempt timed out");
          reject(new Error("Connection timed out"));
        }, 20000);
      });

      console.log("Opening WalletConnect modal...");
      
      const connectionPromise = (async () => {
        await open();
        console.log("Modal opened, attempting connection...");
        
        // Show connecting toast
        toast({
          title: "Connecting Wallet",
          description: "Please approve the connection in your wallet...",
        });
        
        await connect({ connector: walletConnectConnector });
        
        // Check connection status more frequently with more attempts
        for (let i = 0; i < 40; i++) {
          if (isConnected && address) {
            console.log("Connection established on attempt", i + 1);
            return address;
          }
          await new Promise(resolve => setTimeout(resolve, 500)); // 500ms intervals
          console.log("Checking connection status...", i + 1);
        }
        
        throw new Error("Connection not established");
      })();

      const connectedAddress = await Promise.race([
        connectionPromise,
        timeoutPromise
      ]);

      console.log("WalletConnect connection successful:", connectedAddress);
      
      // Network check with 5s timeout
      await Promise.race([
        ensureArbitrumNetwork(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Network check timed out")), 5000))
      ]);
      
      return [connectedAddress as string];
      
    } catch (error: any) {
      console.error("WalletConnect error:", error);
      
      // More specific error messages
      const errorMessage = error.message?.toLowerCase() || '';
      
      if (errorMessage.includes("timed out")) {
        toast({
          title: "Connection Timeout",
          description: "The connection attempt took too long. Please try again.",
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
          title: "Connection Failed",
          description: "Failed to connect with WalletConnect. Please try again.",
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