import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNowStrict } from 'date-fns';

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
  const [timeLeft, setTimeLeft] = useState('');
  const saleEndDate = new Date('2024-01-30T00:00:00');
  const originalPrice = price * 2; // Double the original price
  const discountedPrice = price; // Current price is already the discounted price

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      if (now >= saleEndDate) {
        setTimeLeft('Sale Ended');
        return;
      }
      setTimeLeft(formatDistanceToNowStrict(saleEndDate, { addSuffix: true }));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Format prices with commas
  const formattedOriginalPrice = new Intl.NumberFormat('en-US').format(originalPrice);
  const formattedDiscountedPrice = new Intl.NumberFormat('en-US').format(discountedPrice);

  // Split description into paragraphs
  const paragraphs = description?.split('\n').filter(p => p.trim()) || [];

  return (
    <Card className="w-[350px] h-[500px] bg-black/40 border-[#8E9196]/20 flex flex-col">
      <div className="pt-4">
        <div className="aspect-video w-full">
          <iframe
            src={`${videoUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            frameBorder="0"
          />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <ScrollArea className="flex-1 mb-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-300 text-sm mb-2">
              {paragraph}
            </p>
          ))}
        </ScrollArea>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-yellow-400">Sale ends {timeLeft}</div>
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
      </div>
    </Card>
  );
};

export default NFTCard;