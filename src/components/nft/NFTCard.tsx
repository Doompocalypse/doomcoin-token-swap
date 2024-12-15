import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { formatDistanceToNowStrict } from 'date-fns';
import VideoPlayer from './VideoPlayer';
import Description from './Description';
import PriceSection from './PriceSection';

interface NFTCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  videoUrl: string;
  onPurchase: (id: string) => void;
  isPurchased: boolean;
}

const NFTCard = ({ 
  id, 
  name, 
  description, 
  price, 
  videoUrl, 
  onPurchase, 
  isPurchased 
}: NFTCardProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const saleEndDate = new Date('2025-01-30T00:00:00');
  const originalPrice = price * 2;

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

  return (
    <Card className="w-[350px] h-[480px] bg-black/40 border-[#8E9196]/20 flex flex-col">
      <VideoPlayer videoUrl={videoUrl} />
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <Description description={description} />
        <PriceSection 
          originalPrice={originalPrice}
          discountedPrice={price}
          timeLeft={timeLeft}
          isPurchased={isPurchased}
          onPurchase={() => onPurchase(id)}
        />
      </div>
    </Card>
  );
};

export default NFTCard;