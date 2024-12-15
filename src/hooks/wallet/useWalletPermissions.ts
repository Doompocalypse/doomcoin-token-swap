export const useWalletPermissions = () => {
  const clearExistingPermissions = async (provider: any) => {
    try {
      await provider.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }]
      });
      console.log("Cleared existing permissions");
    } catch (error) {
      console.log("No permissions to revoke:", error);
    }
  };

  const requestAccounts = async (provider: any) => {
    return provider.request({
      method: "eth_requestAccounts",
      params: [{ force: true }]
    });
  };

  return {
    clearExistingPermissions,
    requestAccounts
  };
};