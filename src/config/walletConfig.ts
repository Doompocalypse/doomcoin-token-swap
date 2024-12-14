import { configureChains, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';

// WalletConnect Project ID
const projectId = '0d63e4b93b8abc2ea0a58328d7e7c053';

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [arbitrum],
  [w3mProvider({ projectId })]
);

// Set up wagmi config with autoConnect disabled
export const wagmiConfig = createConfig({
  autoConnect: false, // Explicitly disable auto-connect
  connectors: w3mConnectors({ projectId, chains }),
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
  enableExplorer: true, // Enable the explorer feature
  mobileWallets: [], // Clear default mobile wallets to focus on QR scanning
  desktopWallets: [], // Clear default desktop wallets to focus on QR scanning
  explorerRecommendedWalletIds: [], // Clear recommended wallets
  explorerExcludedWalletIds: ['metaMask'], // Exclude MetaMask from explorer
};