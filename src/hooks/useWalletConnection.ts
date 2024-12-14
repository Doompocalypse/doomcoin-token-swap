import { useAccount, useNetwork } from 'wagmi';
import { useToast } from "@/components/ui/use-toast";

export const useWalletConnection = (
  onConnect: (connected: boolean, account?: string) => void
) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { toast } = useToast();

  return {
    accounts: address ? [address] : [],
    chainId: chain?.id ? `0x${chain.id.toString(16)}` : undefined,
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