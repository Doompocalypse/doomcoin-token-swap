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
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 md:px-8">
          <div className="w-full max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-[#F1F1F1] text-center md:text-left tracking-tight">
                DoomCoin Token Swap
              </h1>
              <WalletConnect onConnect={handleConnect} />
            </div>

            <div className="w-full max-w-xl mx-auto">
              <TokenExchange 
                isConnected={isConnected} 
                connectedAccount={connectedAccount} 
              />
            </div>
          </div>
          <Doomy />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;