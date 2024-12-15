import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NFTCard from './NFTCard';
import { useNFTData } from './useNFTData';
import { useNFTPurchaseHandler } from './NFTPurchaseHandler';

const NFTCarousel = ({ connectedAccount }: { connectedAccount?: string }) => {
  const { nfts, purchasedNfts } = useNFTData(connectedAccount);
  const handlePurchase = useNFTPurchaseHandler(connectedAccount);
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || !nfts) return;

    // Function to move to next slide
    const rotateSlide = () => {
      if (current === nfts.length - 1) {
        api.scrollTo(0);
        setCurrent(0);
      } else {
        api.scrollTo(current + 1);
        setCurrent(prev => prev + 1);
      }
    };

    // Set up the interval
    const intervalId = setInterval(rotateSlide, 3000);
    console.log('Setting up auto-rotation interval');

    // Reset interval on user interaction
    const handleInteraction = () => {
      clearInterval(intervalId);
      console.log('User interaction detected, resetting interval');
      const newIntervalId = setInterval(rotateSlide, 3000);
      return () => clearInterval(newIntervalId);
    };

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
      handleInteraction();
    });

    // Cleanup
    return () => {
      console.log('Cleaning up interval');
      clearInterval(intervalId);
      api.off('select');
    };
  }, [api, current, nfts]);

  if (!nfts) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {nfts.map((nft) => (
            <CarouselItem key={nft.id} className="pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <NFTCard
                  {...nft}
                  videoUrl={nft.video_url}
                  onPurchase={handlePurchase}
                  isPurchased={purchasedNfts?.includes(nft.id) ?? false}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default NFTCarousel;