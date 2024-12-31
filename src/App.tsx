import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, StrictMode } from "react";
import Index from "./pages/Index";
import NFTMarketplace from "./pages/NFTMarketplace";
import AffiliateProgram from "./pages/AffiliateProgram";
import Raven from "./components/Raven";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white">Loading application...</div>
  </div>
);

const ErrorFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white">Something went wrong. Please try refreshing the page.</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={<LoadingFallback />}>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/nft-marketplace" element={<NFTMarketplace />} />
              <Route path="/affiliate-program" element={<AffiliateProgram />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Raven />
        </ErrorBoundary>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;