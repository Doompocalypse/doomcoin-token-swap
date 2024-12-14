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

      // Reduced timeout to 8 seconds for faster feedback
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Connection timed out")), 8000);
      });

      console.log("Opening WalletConnect modal...");
      
      // Immediately try to connect after modal opens
      const connectionPromise = (async () => {
        await open();
        console.log("Modal opened, connecting...");
        
        await connect({ connector: walletConnectConnector });
        
        // Check connection status more frequently
        for (let i = 0; i < 16; i++) {
          if (isConnected && address) {
            console.log("Connection established on attempt", i + 1);
            return address;
          }
          await new Promise(resolve => setTimeout(resolve, 250)); // 250ms intervals
          console.log("Checking connection status...", i + 1);
        }
        
        throw new Error("Connection not established");
      })();

      const connectedAddress = await Promise.race([
        connectionPromise,
        timeoutPromise
      ]);

      console.log("WalletConnect connection successful:", connectedAddress);
      
      // Quick network check with 3s timeout
      await Promise.race([
        ensureArbitrumNetwork(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Network check timed out")), 3000))
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
      } else if (!errorMessage.includes("user rejected") && 
                 !errorMessage.includes("user closed")) {
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