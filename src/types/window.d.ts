interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (params: any) => void) => void;
  removeListener: (event: string, callback: (params: any) => void) => void;
  removeAllListeners?: (event: string) => void;
  isWalletConnect?: boolean;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  disconnect?: () => Promise<void>;
}

interface Window {
  ethereum?: EthereumProvider & {
    providers?: EthereumProvider[];
  };
}