import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { NFT } from "@/types/nft";
import NFTVaultCard from "./NFTVaultCard";

interface NFTVaultSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  nfts: NFT[];
}

const NFTVaultSection = ({ title, description, icon, nfts }: NFTVaultSectionProps) => {
  return (
    <Card className="p-6 bg-black/30 border-gray-700">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <p className="text-gray-400">{description}</p>
      </div>

      {nfts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No NFTs found in this collection
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTVaultCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default NFTVaultSection;