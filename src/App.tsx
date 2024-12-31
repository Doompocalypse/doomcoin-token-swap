import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import Index from "@/pages/Index";
import NFTMarketplace from "@/pages/NFTMarketplace";
import AffiliateProgram from "@/pages/AffiliateProgram";
import NFTVault from "@/pages/NFTVault";

function App() {
  return (
    <ErrorBoundary>
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
  );
}

export default App;
