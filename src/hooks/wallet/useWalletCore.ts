import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMetaMaskProvider } from "./useMetaMaskProvider";
import { useNetworkSwitch } from "./useNetworkSwitch";
import { useWalletPermissions } from "./useWalletPermissions";
import { isSupportedChain } from "@/utils/chainConfig";

export const useWalletCore = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>();
  const { toast } = useToast();

  const { getMetaMaskProvider, validateProvider } = useMetaMaskProvider();
  const { switchToSupportedNetwork } = useNetworkSwitch();
  const { clearExistingPermissions, requestAccounts } = useWalletPermissions();

  const connectMetaMask = useCallback(async () => {
    console.log("Starting MetaMask connection attempt...");

    const provider = getMetaMaskProvider();

    if (!validateProvider(provider)) {
      return;
    }

    try {
      console.log("Using verified MetaMask provider:", provider);

      await clearExistingPermissions(provider);
      const accounts = await requestAccounts(provider);

      console.log("Accounts after selection:", accounts);

      if (accounts.length > 0) {
        await switchToSupportedNetwork(provider);

        // Get the current chain ID after switching
        const currentChainId = await provider.request({ method: "eth_chainId" });

        if (!isSupportedChain(currentChainId)) {
          throw new Error("Failed to switch to a supported network");
        }

        setAccounts(accounts);
        setChainId(currentChainId);

        toast({
          title: "Wallet Connected",
          description: `Connected to MetaMask: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    }
  }, [
    getMetaMaskProvider,
    validateProvider,
    clearExistingPermissions,
    requestAccounts,
    switchToSupportedNetwork,
    toast,
  ]);

  return {
    accounts,
    chainId,
    setAccounts,
    setChainId,
    connectMetaMask,
  };
};
