import { useToast } from "@/components/ui/use-toast";
import WalletConnect from "@/components/WalletConnect";
import VideoBackground from "@/components/VideoBackground";
import NFTCarousel from "@/components/nft/NFTCarousel";
import ErrorBoundary from "@/components/ErrorBoundary";
import CountdownTimer from "@/components/CountdownTimer";
import ProductSlider from "@/components/products/ProductSlider";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Loading application...</div>
  </div>
);

const ErrorFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Something went wrong loading the NFTs. Please try refreshing the page.</div>
  </div>
);

const About = () => {
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
                </DropdownMenuContent>
              </DropdownMenu>
              <h1 className="text-2xl md:text-3xl font-bold text-[#F1F1F1] tracking-tight">
                NFT Marketplace
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <WalletConnect onConnect={handleConnect} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 pb-12 px-4">
          <div className="w-full max-w-5xl mx-auto space-y-16">
            <CountdownTimer />
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Choose your Rank</h2>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed tracking-wide px-4">
                Claim your badge now to breach the portal into the Doompocalypse.
                <br className="hidden sm:block" />
                Unlock exclusive perks, bonus resources, and classified intel –
                <br className="hidden sm:block" />
                Will you survive the revolution?
              </p>
            </div>
            <ErrorBoundary fallback={<ErrorFallback />}>
              <NFTCarousel connectedAccount={connectedAccount} />
            </ErrorBoundary>

            {/* Product Slider Section */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white">Fragmented Masterpieces: A Post-Apocalyptic NFT Collection</h2>
                <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed tracking-wide px-4">
                  Salvage remnants of the doomed world's most iconic art collections. Gather all the scattered fragments to restore your pieces back to priceless condition. Claim your place among the elite collectors of the post-apocalyptic era or capitalize on your finds.
                </p>
              </div>
              <ProductSlider />
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  );
};

export default About;
