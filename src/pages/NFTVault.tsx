import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Image, Layers } from "lucide-react";
import Header from "@/components/layout/Header";
import VideoBackground from "@/components/VideoBackground";
import { useToast } from "@/hooks/use-toast";
import NFTVaultSection from "@/components/nft/vault/NFTVaultSection";
import { useRealNFTData } from "@/hooks/useRealNFTData";
import { useWallet } from "@/contexts/WalletContext";

const NFTVault = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { walletAddress } = useWallet();
  const { nfts } = useRealNFTData(walletAddress);

  useEffect(() => {
    if (!walletAddress) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to view your NFTs",
      });
    }
  }, [walletAddress, toast]);

  // Separate NFTs by collection
  const tierBadges = nfts?.filter(nft => nft.name.includes("Tier Badge")) || [];
  const fragmentedMasterpieces = nfts?.filter(nft => nft.name.includes("Fragmented")) || [];

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Shield className="h-8 w-8" />
              My NFT Vault
            </h1>
          </div>

          {!walletAddress ? (
            <div className="text-center py-12">
              <p className="text-white text-lg mb-4">Connect your wallet to view your NFTs</p>
            </div>
          ) : (
            <div className="space-y-8">
              <NFTVaultSection
                title="Tier Badges"
                description="Your collection of exclusive tier badges"
                icon={<Image className="h-6 w-6" />}
                nfts={tierBadges}
              />
              
              <NFTVaultSection
                title="Fragmented Masterpieces"
                description="Your collection of fragmented masterpiece NFTs"
                icon={<Layers className="h-6 w-6" />}
                nfts={fragmentedMasterpieces}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NFTVault;