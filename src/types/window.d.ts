interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (params: any) => void) => void;
    removeListener: (event: string, callback: (params: any) => void) => void;
    removeAllListeners?: (event: string) => void;
    isWalletConnect?: boolean;
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    providers?: Array<{
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      request?: (args: { method: string; params?: any[] }) => Promise<any>;
    }>;
    disconnect?: () => Promise<void>;
  };
}