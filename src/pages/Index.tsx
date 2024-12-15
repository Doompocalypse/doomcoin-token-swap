import { useToast } from "@/components/ui/use-toast";
import TokenExchange from "@/components/TokenExchange";
import WalletConnect from "@/components/WalletConnect";
import Doomy from "@/components/Doomy";
import VideoBackground from "@/components/VideoBackground";
import { useState, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Loading application...</div>
  </div>
);

const ErrorFallback = ({ error }: { error: Error }) => {
  console.error("Application error:", error);
  return (
    <div className="min-h-screen bg-[#221F26] p-4 md:p-8 flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-400">Please refresh the page and try again.</p>
      </div>
    </div>
  );
};

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const { toast } = useToast();

  const handleConnect = (connected: boolean, account?: string) => {
    console.log("Connection status:", connected, "Account:", account);
    setIsConnected(connected);
    setConnectedAccount(account);
  };

  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error()} />}>
      <Suspense fallback={<LoadingFallback />}>
        <VideoBackground />
        <div className="relative min-h-screen">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-[#F1F1F1] tracking-tight">
                DoomCoin Token Swap
              </h1>
              <WalletConnect onConnect={handleConnect} />
            </div>
          </header>

          {/* Main Content */}
          <main className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-2xl mx-auto">
              <TokenExchange 
                isConnected={isConnected} 
                connectedAccount={connectedAccount} 
              />
            </div>
          </main>
          <Doomy />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;