import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { useToast } from "@/hooks/use-toast";
import { useNetworkSwitch } from "./useNetworkSwitch";

export const useWalletConnectConnection = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const { ensureArbitrumNetwork } = useNetworkSwitch();

  const connectWalletConnect = async () => {
    try {
      console.log("Opening WalletConnect modal...");
      
      // First, open the WalletConnect modal
      await open();
      
      // We need to wait for the connection to be established
      // The Web3Modal will handle the QR code display and scanning
      if (isConnected && address) {
        console.log("WalletConnect connection successful:", address);
        
        // Check if we need to switch networks first
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