import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import Index from "@/pages/Index";
import NFTMarketplace from "@/pages/NFTMarketplace";
import AffiliateProgram from "@/pages/AffiliateProgram";
import NFTVault from "@/pages/NFTVault";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-red-50 p-8 text-center">
        <h2 className="mb-4 text-xl font-bold text-red-800">Something went wrong</h2>
        <pre className="text-sm text-red-600">{error.message}</pre>
      </div>
    </div>
  );
}

function App() {
  return (
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
  );
}

export default App;