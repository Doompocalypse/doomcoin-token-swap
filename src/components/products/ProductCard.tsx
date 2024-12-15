import { Card } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

const ProductCard = ({ name, description, imageUrl, price }: ProductCardProps) => {
  return (
    <Card className="w-full max-w-[600px] mx-auto bg-black/40 border-[#8E9196]/20">
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-white">${price.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;