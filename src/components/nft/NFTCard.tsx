import { memo } from 'react';
import { Card } from "@/components/ui/card";
import Description from "./Description";
import PriceSection from "./PriceSection";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageOff, Loader } from "lucide-react";
import { useState } from "react";

interface NFTCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isPurchased: boolean;
  balance?: number;
  onPurchase: (id: string) => void;
}

const NFTCard = memo(({ 
  id, 
  name, 
  description, 
  price, 
  imageUrl, 
  isPurchased,
  balance = 0,
  onPurchase 
}: NFTCardProps) => {
  console.log(`Rendering NFTCard: ${name}, Price: ${price} DMC`);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const handlePurchase = () => {
    onPurchase(id);
  };

  return (
    <Card className="w-full max-w-[400px] mx-auto bg-black/40 border-[#8E9196]/20">
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
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover rounded-t-lg transition-opacity duration-300 ${
            isLoading || hasError ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => {
            console.log(`Image loaded successfully for NFT: ${name}`);
            setIsLoading(false);
          }}
          onError={() => {
            console.error(`Error loading image for NFT: ${name}`);
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </AspectRatio>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
          {balance > 0 && (
            <span className="text-sm text-white bg-green-500/20 px-2 py-1 rounded">
              Owned: {balance}
            </span>
          )}
        </div>
        <Description description={description} />
        <PriceSection
          originalPrice={price}
          discountedPrice={price}
          isPurchased={isPurchased}
          onPurchase={handlePurchase}
        />
      </div>
    </Card>
  );
});

NFTCard.displayName = 'NFTCard';

export default NFTCard;