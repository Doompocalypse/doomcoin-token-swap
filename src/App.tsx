import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createConfig, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi';
import { w3mConnectors } from '@web3modal/wagmi/react';
import { http } from 'viem';
import Index from "./pages/Index";

// WalletConnect v2 Project ID
const projectId = '0d63e4b93b8abc2ea0a58328d7e7c053';

const metadata = {
  name: 'Web3Modal Example',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet];

const config = createConfig({
  chains: [mainnet],
  connectors: w3mConnectors({ 
    projectId, 
    chains,
    metadata 
  }),
  transports: {
    [mainnet.id]: http()
  }
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark'
});

const queryClient = new QueryClient();

const App = () => (
  <>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </>
);

export default App;