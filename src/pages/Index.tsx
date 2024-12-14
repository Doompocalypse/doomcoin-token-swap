import { useToast } from "@/components/ui/use-toast";
import TokenExchange from "@/components/TokenExchange";
import WalletConnect from "@/components/WalletConnect";
import Doomy from "@/components/Doomy";
import { useState, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] p-4 md:p-8 flex items-center justify-center">
    <div className="text-white">Loading...</div>
  </div>
);

const ErrorFallback = ({ error }: { error: Error }) => {
  console.error("Application error:", error);
  return (
    <div className="min-h-screen bg-[#221F26] p-4 md:p-8 flex items-center justify-center">
      <div className="text-white">
        <h2 className="text-xl mb-2">Something went wrong</h2>
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
        <div className="min-h-screen bg-[#221F26] p-4 md:p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-3xl font-bold text-[#F1F1F1]">
                Swap Tokens
              </h1>
              <WalletConnect onConnect={handleConnect} />
            </div>

            <TokenExchange isConnected={isConnected} connectedAccount={connectedAccount} />
          </div>
          <Doomy />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;