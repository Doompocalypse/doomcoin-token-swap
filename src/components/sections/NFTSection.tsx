import NFTCarousel from "@/components/nft/NFTCarousel";

interface NFTSectionProps {
  connectedAccount?: string;
  onInsufficientBalance?: () => void;
}

const NFTSection = ({ connectedAccount, onInsufficientBalance }: NFTSectionProps) => {
  return (
    <section className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">NFT Tiers</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose your tier to gain early access and exclusive rewards in the Doom-POCalypse universe
        </p>
      </div>
      
      <div className="pt-8">
        <NFTCarousel 
          connectedAccount={connectedAccount}
          onInsufficientBalance={onInsufficientBalance}
        />
      </div>
    </section>
  );
};

export default NFTSection;