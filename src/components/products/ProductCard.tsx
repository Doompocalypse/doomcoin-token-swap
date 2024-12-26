import { memo } from 'react';
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  price: number;
}

const ProductCard = memo(({ name, description, imageUrl, price }: ProductCardProps) => {
  console.log(`Rendering ProductCard: ${name}`);
  
  return (
    <Card className="w-full max-w-[600px] mx-auto bg-black/40 border-[#8E9196]/20">
      <AspectRatio ratio={1}>
        <img 
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </AspectRatio>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-white">${price.toFixed(2)} DMC</span>
        </div>
      </div>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;