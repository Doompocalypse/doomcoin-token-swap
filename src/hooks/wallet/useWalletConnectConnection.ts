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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const attemptConnection = async (connector: any, attempt: number = 1): Promise<string> => {
    try {
      console.log(`Connection attempt ${attempt}...`);
      await connect({ connector });
      
      // Check connection with exponential backoff
      const maxRetries = 5;
      const baseDelay = 1000; // Start with 1 second
      
      for (let i = 0; i < maxRetries; i++) {
        if (isConnected && address) {
          console.log(`Connection successful on retry ${i + 1}`);
          return address;
        }
        
        const waitTime = baseDelay * Math.pow(2, i);
        console.log(`Waiting ${waitTime}ms before next check...`);
        await delay(waitTime);
      }
      
      throw new Error("Connection verification failed");
    } catch (error) {
      if (attempt < 3) { // Try up to 3 times
        console.log(`Retrying connection, attempt ${attempt + 1}`);
        await delay(1000); // Wait 1 second before retry
        return attemptConnection(connector, attempt + 1);
      }
      throw error;
    }
  };

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

      console.log("Opening WalletConnect modal...");
      
      toast({
        title: "Connecting Wallet",
        description: "Please approve the connection in your wallet...",
      });
      
      await open();
      console.log("Modal opened, attempting connection...");
      
      const connectedAddress = await attemptConnection(walletConnectConnector);
      console.log("WalletConnect connection successful:", connectedAddress);
      
      // Network check with 5s timeout
      await Promise.race([
        ensureArbitrumNetwork(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Network check timed out")), 5000))
      ]);
      
      return [connectedAddress];
      
    } catch (error: any) {
      console.error("WalletConnect error:", error);
      
      const errorMessage = error.message?.toLowerCase() || '';
      
      if (errorMessage.includes("verification failed")) {
        toast({
          title: "Connection Failed",
          description: "Unable to verify wallet connection. Please try again.",
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