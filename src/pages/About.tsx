import { useToast } from "@/components/ui/use-toast";
import WalletConnect from "@/components/WalletConnect";
import VideoBackground from "@/components/VideoBackground";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Loading application...</div>
  </div>
);

const About = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConnect = (connected: boolean, account?: string) => {
    console.log("Connection status:", connected, "Account:", account);
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <VideoBackground />
      <div className="relative min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-[#F1F1F1] tracking-tight">
                NFT Marketplace
              </h1>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center px-3 py-1 text-sm text-white hover:text-gray-300">
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white">
                  <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer">
                    Token Swap
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/about")} className="cursor-pointer">
                    About
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-4">
              <WalletConnect onConnect={handleConnect} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-6">About DoomCoin Token Swap</h2>
            <p className="text-lg mb-4">
              DoomCoin Token Swap is a decentralized exchange platform that allows users to easily swap tokens on the Arbitrum network.
            </p>
            <p className="text-lg mb-4">
              Our platform provides a secure and efficient way to trade cryptocurrencies with minimal fees and maximum convenience.
            </p>
          </div>
        </main>
      </div>
    </Suspense>
  );
};

export default About;