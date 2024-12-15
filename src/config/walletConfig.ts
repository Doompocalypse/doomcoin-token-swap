import { configureChains, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';

const projectId = '0d63e4b93b8abc2ea0a58328d7e7c053';

const { chains, publicClient } = configureChains(
  [arbitrum],
  [w3mProvider({ projectId })]
);

// Clear any existing wallet connection data on initialization
if (typeof window !== 'undefined') {
  const walletKeys = Object.keys(window.localStorage).filter(key => 
    key.toLowerCase().includes('wagmi') || 
    key.toLowerCase().includes('wc@') ||
    key.toLowerCase().includes('walletconnect')
  );
  walletKeys.forEach(key => window.localStorage.removeItem(key));
  console.log("Cleared existing wallet connection data");
}

export const wagmiConfig = createConfig({
  autoConnect: false, // Ensure autoConnect is false
  connectors: w3mConnectors({ 
    projectId, 
    chains
  }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);

export const web3modalProps = {
  projectId,
  ethereumClient,
  defaultChain: arbitrum,
  themeMode: 'dark' as const,
  metadata: {
    name: 'DoomCoin Token Swap',
    description: 'Swap tokens on Arbitrum',
    url: window.location.origin,
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
};