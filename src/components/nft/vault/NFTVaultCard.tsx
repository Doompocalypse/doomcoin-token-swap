import { useState } from "react";
import { Card } from "@/components/ui/card";
import { NFT } from "@/types/nft";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageOff, Loader } from "lucide-react";

interface NFTVaultCardProps {
  nft: NFT;
}

const NFTVaultCard = ({ nft }: NFTVaultCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <Card className="overflow-hidden bg-black/40 border-gray-700 hover:border-gray-600 transition-colors">
      <AspectRatio ratio={1} className="relative bg-zinc-900/50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-white/50" />
          </div>
        )}
        <img
          src={nft.imageUrl}
          alt={nft.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading || hasError ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </AspectRatio>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{nft.name}</h3>
        {nft.balance && nft.balance > 1 && (
          <span className="inline-block px-2 py-1 rounded bg-white/10 text-sm text-white">
            Owned: {nft.balance}
          </span>
        )}
      </div>
    </Card>
  );
};

export default NFTVaultCard;