import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import NFTMarketplace from "@/pages/NFTMarketplace";
import AffiliateProgram from "@/pages/AffiliateProgram";
import NFTVault from "@/pages/NFTVault";
import { WalletProvider } from "./contexts/WalletContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 2,
    },
  },
});

// Create error fallback component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <pre className="text-red-400">{error.message}</pre>
      </div>
    </div>
  );
};

function App() {
  const handleWalletConnection = (connected: boolean, account?: string) => {
    console.log("Wallet connection status:", connected, "Account:", account);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider onConnect={handleWalletConnection}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/nft-marketplace" element={<NFTMarketplace />} />
              <Route path="/affiliate-program" element={<AffiliateProgram />} />
              <Route path="/nft-vault" element={<NFTVault />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </ErrorBoundary>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;