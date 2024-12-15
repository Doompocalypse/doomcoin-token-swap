export const detectWalletProviders = () => {
  const providers = {
    isMetaMask: false,
    isCoinbaseWallet: false
  };

  if (typeof window === 'undefined') return providers;

  if (window.ethereum) {
    // Check for MetaMask
    if (window.ethereum.isMetaMask) {
      providers.isMetaMask = true;
    }
    
    // Check for Coinbase Wallet
    // Coinbase Wallet sets a specific provider property
    const isCoinbaseWallet = window.ethereum.isCoinbaseWallet;
    const hasCoinbaseProvider = window.ethereum.providers?.some(
      provider => provider.isCoinbaseWallet
    );
    
    if (isCoinbaseWallet || hasCoinbaseProvider) {
      providers.isCoinbaseWallet = true;
    }
  }

  console.log("Detected wallet providers:", providers);
  return providers;
};