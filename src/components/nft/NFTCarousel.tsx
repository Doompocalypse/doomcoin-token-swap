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

  console.log('NFTCarousel render - nfts:', nfts);
  console.log('NFTCarousel render - purchasedNfts:', purchasedNfts);

  useEffect(() => {
    if (!api || !nfts) return;

    console.log('Setting up carousel rotation');

    const rotateSlide = () => {
      if (current === nfts.length - 1) {
        api.scrollTo(0);
        setCurrent(0);
      } else {
        api.scrollTo(current + 1);
        setCurrent(prev => prev + 1);
      }
      console.log('Rotating to next slide:', current);
    };

    let intervalId = setInterval(rotateSlide, 3000);
    console.log('Initial interval set');

    const handleInteraction = () => {
      console.log('User interaction detected');
      setCurrent(api.selectedScrollSnap());
      clearInterval(intervalId);
      intervalId = setInterval(rotateSlide, 3000);
      console.log('Interval reset after user interaction');
    };

    api.on('select', handleInteraction);

    return () => {
      console.log('Cleaning up carousel effects');
      clearInterval(intervalId);
      api.off('select', handleInteraction);
    };
  }, [api, current, nfts]);

  if (!nfts) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {nfts.map((nft) => (
            <CarouselItem key={nft.id} className="pl-4 basis-auto md:basis-1/2 lg:basis-1/3">
              <div className="w-[350px]">
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
        <div className="absolute -left-12 top-1/2 -translate-y-1/2">
          <CarouselPrevious className="relative left-0" />
        </div>
        <div className="absolute -right-12 top-1/2 -translate-y-1/2">
          <CarouselNext className="relative right-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default NFTCarousel;