import { memo } from 'react';
import { Card } from "@/components/ui/card";
import VideoPlayer from "./VideoPlayer";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  price: number;
}

const ProductCard = memo(({ name, description, videoUrl, price }: ProductCardProps) => {
  console.log(`Rendering ProductCard: ${name}`);
  
  return (
    <Card className="w-full max-w-[600px] mx-auto bg-black/40 border-[#8E9196]/20">
      <VideoPlayer videoUrl={videoUrl} />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-white">${price.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;