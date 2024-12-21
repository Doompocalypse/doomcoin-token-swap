import ErrorBoundary from "@/components/ErrorBoundary";
import NFTCarousel from "@/components/nft/NFTCarousel";

interface NFTSectionProps {
  connectedAccount?: string;
}

const NFTSection = ({ connectedAccount }: NFTSectionProps) => {
  return (
    <div className="space-y-4">
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
  );
};

const ErrorFallback = () => (
  <div className="min-h-screen bg-[#221F26] flex items-center justify-center">
    <div className="text-white text-lg">Something went wrong loading the NFTs. Please try refreshing the page.</div>
  </div>
);

export default NFTSection;