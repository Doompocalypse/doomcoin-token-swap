import { useToast } from "@/components/ui/use-toast";
import WalletConnect from "@/components/WalletConnect";
import VideoBackground from "@/components/VideoBackground";
import NFTCarousel from "@/components/nft/NFTCarousel";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  maxSeconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    maxSeconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2025-01-30T00:00:00');
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          maxSeconds: 0,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const totalSeconds = Math.floor(difference / 1000);
      const maxSeconds = Math.floor((launchDate.getTime() - new Date().getTime()) / 1000);
      
      return {
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        maxSeconds,
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progress = ((timeLeft.maxSeconds - timeLeft.totalSeconds) / timeLeft.maxSeconds) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto bg-black/40 p-6 rounded-lg space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">BETA Launch Countdown</h2>
        <p className="text-gray-300">NFT Badges will return to full price on January 30th, 2025</p>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-sm text-gray-400">Days</div>
        </div>
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
          <div className="text-sm text-gray-400">Hours</div>
        </div>
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-400">Minutes</div>
        </div>
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-400">Seconds</div>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

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
        <main className="pt-24 pb-12 px-4">
          <div className="w-full max-w-5xl mx-auto space-y-8">
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
          </div>
        </main>
      </div>
    </Suspense>
  );
};

export default About;