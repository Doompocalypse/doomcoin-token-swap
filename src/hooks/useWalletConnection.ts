import { useAccount, useChainId } from 'wagmi';
import { useToast } from "@/components/ui/use-toast";

export const useWalletConnection = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();

  return {
    accounts: address ? [address] : [],
    chainId: chainId ? `0x${chainId.toString(16)}` : undefined,
    connectWallet: async () => {
      if (!isConnected) {
        toast({
          title: "Connect Wallet",
          description: "Please connect your wallet using the modal",
        });
      }
    }
  };
};