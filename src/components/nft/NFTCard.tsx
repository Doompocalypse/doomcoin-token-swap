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

  return (
    <Card className="w-full max-w-sm mx-auto bg-black/40 border-[#8E9196]/20">
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        <iframe
          src={`${videoUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          frameBorder="0"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-white font-bold">{price} DMC</span>
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