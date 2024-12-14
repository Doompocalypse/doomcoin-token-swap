import { configureChains, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';

// WalletConnect Project ID
const projectId = '0d63e4b93b8abc2ea0a58328d7e7c053';

// Get the current domain for allowed origins
const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';

// Configure chains & providers with proper metadata
const { chains, publicClient } = configureChains(
  [arbitrum],
  [w3mProvider({ 
    projectId
  })]
);

// Set up wagmi config
export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({ 
    projectId, 
    chains,
    version: '2'
  }),
  publicClient,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiConfig, chains);

// Web3Modal Component Props
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
  metadata: {
    name: 'DoomCoin Token Swap',
    description: 'Swap tokens on Arbitrum',
    url: currentDomain,
    icons: []
  },
  standaloneChains: chains.map(chain => chain.id),
  defaultChainId: arbitrum.id
};