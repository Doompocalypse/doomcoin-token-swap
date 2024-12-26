import { memo } from 'react';
import { Card } from "@/components/ui/card";
import Description from "./Description";
import PriceSection from "./PriceSection";
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
  imageUrl, 
  isPurchased, 
  onPurchase 
}: NFTCardProps) => {
  console.log(`Rendering NFTCard: ${name}`);
  
  const handlePurchase = () => {
    onPurchase(id);
  };

  // Get the corresponding image based on the NFT ID
  const getNFTImage = (id: string) => {
    const images = {
      '1': '/lovable-uploads/d89c3541-c973-4fc0-9fe9-7adf6ad0a40c.png',
      '2': '/lovable-uploads/b782cb08-ff38-49a9-a223-199ae309434f.png',
      '3': '/lovable-uploads/f8c3764a-5c61-450a-8fff-4f7daf9d6b24.png',
      '4': '/lovable-uploads/6dd04cea-cba0-44b0-895a-8f621da2695f.png',
      '5': '/lovable-uploads/97c7a9ea-bec9-4213-b473-ef285882518d.png',
      '6': '/lovable-uploads/0c37c47b-cfd2-4cc0-9cbe-c285a6d4ff34.png'
    };
    return images[id as keyof typeof images] || imageUrl;
  };

  return (
    <Card className="w-full max-w-[400px] mx-auto bg-black/40 border-[#8E9196]/20">
      <AspectRatio ratio={1} className="relative">
        <img 
          src={getNFTImage(id)}
          alt={name}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </AspectRatio>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
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