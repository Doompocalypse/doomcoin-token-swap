import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface NFTCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  videoUrl: string;
  onPurchase: (id: string) => void;
  isPurchased: boolean;
}

const NFTCard = ({ id, name, description, price, videoUrl, onPurchase, isPurchased }: NFTCardProps) => {
  const { toast } = useToast();

  const handlePurchase = () => {
    if (isPurchased) {
      toast({
        title: "Already Owned",
        description: "You already own this NFT",
        variant: "destructive",
      });
      return;
    }
    onPurchase(id);
  };

  const formattedPrice = new Intl.NumberFormat('en-US').format(price);

  return (
    <Card className="w-[350px] bg-black/40 border-[#8E9196]/20 h-[420px] flex flex-col">
      <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
        <iframe
          src={`${videoUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          frameBorder="0"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <div className="flex-grow overflow-y-auto mb-4">
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-white font-bold">${formattedPrice} DMC</span>
          <Button 
            onClick={handlePurchase}
            disabled={isPurchased}
            className={isPurchased ? "bg-gray-500" : "bg-primary hover:bg-primary/90"}
          >
            {isPurchased ? "Owned" : "Purchase"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NFTCard;