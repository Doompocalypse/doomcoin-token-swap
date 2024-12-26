import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PriceSectionProps {
  originalPrice: number;
  discountedPrice: number;
  isPurchased: boolean;
  onPurchase: () => void;
}

const PriceSection = ({ 
  originalPrice, 
  discountedPrice, 
  isPurchased, 
  onPurchase 
}: PriceSectionProps) => {
  const { toast } = useToast();
  const formattedOriginalPrice = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(originalPrice);
  const formattedDiscountedPrice = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(discountedPrice);

  const handlePurchase = () => {
    if (isPurchased) {
      toast({
        title: "Already Owned",
        description: "You already own this NFT",
        variant: "destructive",
      });
      return;
    }
    onPurchase();
  };

  return (
    <div className="mt-2 border-t border-gray-700 pt-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-gray-400 line-through text-sm">{formattedOriginalPrice} DMC</span>
          <span className="text-white font-bold">{formattedDiscountedPrice} DMC</span>
        </div>
        <Button 
          onClick={handlePurchase}
          disabled={isPurchased}
          className={`${isPurchased ? 'bg-gray-500' : 'bg-white hover:bg-white/90'} text-black`}
        >
          {isPurchased ? "Owned" : "Mint NFT"}
        </Button>
      </div>
    </div>
  );
};

export default PriceSection;