export const useWalletPermissions = () => {
  const clearExistingPermissions = async (provider: any) => {
    try {
      await provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      console.log("Cleared existing wallet permissions");
    } catch (error) {
      console.log("User rejected permission reset");
      throw new Error("User rejected permission reset");
    }
  };

  const requestAccounts = async (provider: any) => {
    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      console.log("Accounts received:", accounts);
      return accounts;
    } catch (error) {
      console.error("Error requesting accounts:", error);
      throw new Error("Failed to get accounts");
    }
  };

  return {
    clearExistingPermissions,
    requestAccounts,
  };
};