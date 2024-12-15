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
    if (window.ethereum.isCoinbaseWallet || (window.ethereum.providers && window.ethereum.providers.find(p => p.isCoinbaseWallet))) {
      providers.isCoinbaseWallet = true;
    }
  }

  console.log("Detected wallet providers:", providers);
  return providers;
};