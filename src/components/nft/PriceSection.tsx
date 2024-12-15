import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PriceSectionProps {
  originalPrice: number;
  discountedPrice: number;
  timeLeft: string;
  isPurchased: boolean;
  onPurchase: () => void;
}

const PriceSection = ({ 
  originalPrice, 
  discountedPrice, 
  timeLeft, 
  isPurchased, 
  onPurchase 
}: PriceSectionProps) => {
  const { toast } = useToast();
  const formattedOriginalPrice = new Intl.NumberFormat('en-US').format(originalPrice);
  const formattedDiscountedPrice = new Intl.NumberFormat('en-US').format(discountedPrice);

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
      <div className="text-sm text-yellow-400 mb-1">Sale ends {timeLeft}</div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-gray-400 line-through text-sm">${formattedOriginalPrice} DMC</span>
          <span className="text-white font-bold">${formattedDiscountedPrice} DMC</span>
        </div>
        <Button 
          onClick={handlePurchase}
          disabled={isPurchased}
          className={`${isPurchased ? 'bg-gray-500' : 'bg-white hover:bg-white/90'} text-black`}
        >
          {isPurchased ? "Owned" : "Purchase"}
        </Button>
      </div>
    </div>
  );
};

export default PriceSection;