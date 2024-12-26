import { memo } from 'react';
import { Card } from "@/components/ui/card";
import Description from "./Description";
import PriceSection from "./PriceSection";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface NFTCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  videoUrl: string;
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
  console.log(`Rendering NFTCard: ${name}, Balance: ${balance}`);
  
  const handlePurchase = () => {
    onPurchase(id);
  };

  return (
    <Card className="w-full max-w-[400px] mx-auto bg-black/40 border-[#8E9196]/20">
      <AspectRatio ratio={1} className="relative">
        <img 
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-t-lg"
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
          discountedPrice={Math.floor(price * 0.5)}
          isPurchased={isPurchased}
          onPurchase={handlePurchase}
        />
      </div>
    </Card>
  );
});

NFTCard.displayName = 'NFTCard';

export default NFTCard;