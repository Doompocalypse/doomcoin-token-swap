import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Index from "./pages/Index";
import NFTMarketplace from "./pages/About";
import TokenDeploymentTest from "./pages/TokenDeploymentTest";
import DMCTokenDeployment from "./pages/DMCTokenDeployment";

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white">Loading application...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<NFTMarketplace />} />
            <Route path="/token-deployment-test" element={<TokenDeploymentTest />} />
            <Route path="/dmc-token-deployment" element={<DMCTokenDeployment />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;