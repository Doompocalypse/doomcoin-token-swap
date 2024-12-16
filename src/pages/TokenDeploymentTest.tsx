import { useToast } from "@/components/ui/use-toast";
import WalletConnect from "@/components/WalletConnect";
import VideoBackground from "@/components/VideoBackground";
import ErrorBoundary from "@/components/ErrorBoundary";
import NFTDeployment from "@/components/nft/NFTDeployment";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Loading application...</div>
  </div>
);

const TokenDeploymentTest = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connectedAccount, setConnectedAccount] = useState<string>();

  const handleConnect = (connected: boolean, account?: string) => {
    console.log("Connection status:", connected, "Account:", account);
    setConnectedAccount(account);
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <VideoBackground />
      <div className="relative min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-md transition-colors">
                  <Menu className="h-6 w-6 text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white text-black border border-gray-200">
                  <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer hover:bg-gray-100">
                    Token Swap
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/about")} className="cursor-pointer hover:bg-gray-100">
                    NFT Marketplace
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/token-deployment-test")} className="cursor-pointer hover:bg-gray-100">
                    Token Deployment Test
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <h1 className="text-2xl md:text-3xl font-bold text-[#F1F1F1] tracking-tight">
                Token Deployment Test
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <WalletConnect onConnect={handleConnect} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 pb-12 px-4">
          <div className="w-full max-w-3xl mx-auto space-y-8">
            <Alert className="bg-blue-900/20 text-blue-100 border-blue-800">
              <AlertDescription className="flex flex-col gap-2">
                <p>Need test ETH for deployment? Get Sepolia ETH from these faucets:</p>
                <div className="flex flex-col gap-1">
                  <a 
                    href="https://sepoliafaucet.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                  >
                    Alchemy Faucet <ExternalLink className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://www.infura.io/faucet/sepolia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                  >
                    Infura Faucet <ExternalLink className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://faucet.quicknode.com/ethereum/sepolia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
                  >
                    QuickNode Faucet <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </AlertDescription>
            </Alert>
            <ErrorBoundary fallback={<div>Error loading NFT deployment interface</div>}>
              <NFTDeployment />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </Suspense>
  );
};

export default TokenDeploymentTest;