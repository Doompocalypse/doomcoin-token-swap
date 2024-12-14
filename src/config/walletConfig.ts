import { configureChains, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';

// WalletConnect Project ID
const projectId = '0d63e4b93b8abc2ea0a58328d7e7c053';

// Get the current domain for allowed origins
const currentDomain = typeof window !== 'undefined' ? window.location.host : '';

// Configure chains & providers with metadata
const { chains, publicClient } = configureChains(
  [arbitrum],
  [w3mProvider({ projectId })]
);

// Set up wagmi config with autoConnect disabled
export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({ 
    projectId, 
    chains,
    // Remove version as it's not in the type definition
  }),
  publicClient,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiConfig, chains);

// Web3Modal Component Props with updated configuration
export const web3modalProps = {
  projectId,
  ethereumClient,
  defaultChain: arbitrum,
  themeMode: 'dark' as const,
  enableExplorer: true,
  mobileWallets: [],
  desktopWallets: [],
  explorerRecommendedWalletIds: [],
  explorerExcludedWalletIds: ['metaMask'],
  // Add metadata for WalletConnect
  metadata: {
    name: 'DoomCoin Token Swap',
    description: 'Swap tokens on Arbitrum',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: []
  },
  // Enable all available wallet connection methods
  walletImages: {},
  privacyPolicyUrl: undefined,
  termsOfServiceUrl: undefined,
};