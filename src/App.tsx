import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import NFTMarketplace from "@/pages/NFTMarketplace";
import AffiliateProgram from "@/pages/AffiliateProgram";
import NFTVault from "@/pages/NFTVault";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 2,
      refetchOnWindowFocus: false // Add this to prevent unnecessary refetches
    },
  },
});

// Create error fallback component
const ErrorFallback = ({ error }: { error: Error }) => {
  console.error("Application error:", error); // Add error logging
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
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nft-marketplace" element={<NFTMarketplace />} />
            <Route path="/affiliate-program" element={<AffiliateProgram />} />
            <Route path="/nft-vault" element={<NFTVault />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;