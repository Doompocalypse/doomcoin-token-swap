import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface PriceSectionProps {
  originalPrice: number;
  discountedPrice: number;
  isPurchased: boolean;
  onPurchase: () => void;
  connectedAccount?: string;
}

const PriceSection = ({ 
  originalPrice, 
  discountedPrice, 
  isPurchased, 
  onPurchase,
  connectedAccount 
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

    if (!connectedAccount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, we'll simulate insufficient balance
    // In a real implementation, you would check the actual DMC balance
    const hasInsufficientBalance = Math.random() > 0.5;
    
    if (hasInsufficientBalance) {
      toast({
        title: "Insufficient DMC Balance",
        description: (
          <div className="flex flex-col gap-2">
            <span>You don't have enough DMC tokens to mint this NFT.</span>
            <Link 
              to="/" 
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Click here to swap for more DMC tokens
            </Link>
          </div>
        ),
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
          <span className="text-gray-400 line-through text-sm">${formattedOriginalPrice} DMC</span>
          <span className="text-white font-bold">${formattedDiscountedPrice} DMC</span>
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