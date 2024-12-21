import { memo } from 'react';
import { Card } from "@/components/ui/card";
import Description from "./Description";
import PriceSection from "./PriceSection";
import VideoPlayer from "./VideoPlayer";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface NFTCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  videoUrl: string;
  imageUrl: string;
  isPurchased: boolean;
  onPurchase: (id: string) => void;
}

const NFTCard = memo(({ 
  id, 
  name, 
  description, 
  price, 
  videoUrl,
  imageUrl, 
  isPurchased, 
  onPurchase 
}: NFTCardProps) => {
  console.log(`Rendering NFTCard: ${name}`);
  
  const handlePurchase = () => {
    onPurchase(id);
  };

  // Calculate discounted price (50% off)
  const discountedPrice = Math.floor(price * 0.5);

  return (
    <Card className="w-full max-w-[400px] mx-auto bg-black/40 border-[#8E9196]/20">
      <AspectRatio ratio={16/9} className="relative">
        <img 
          src={imageUrl} 
          alt={name}
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
        <div className="absolute inset-0 z-0">
          <VideoPlayer videoUrl={videoUrl} />
        </div>
      </AspectRatio>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
        <Description description={description} />
        <PriceSection
          originalPrice={price}
          discountedPrice={discountedPrice}
          isPurchased={isPurchased}
          onPurchase={handlePurchase}
        />
      </div>
    </Card>
  );
});

NFTCard.displayName = 'NFTCard';

export default NFTCard;