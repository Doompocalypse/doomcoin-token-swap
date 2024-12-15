import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NFTCard from './NFTCard';
import { useCarouselConfig } from './CarouselConfig';
import { useNFTData } from './useNFTData';
import { useNFTPurchaseHandler } from './NFTPurchaseHandler';

const NFTCarousel = ({ connectedAccount }: { connectedAccount?: string }) => {
  const emblaRef = useCarouselConfig();
  const { nfts, purchasedNfts } = useNFTData(connectedAccount);
  const handlePurchase = useNFTPurchaseHandler(connectedAccount);

  if (!nfts) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Carousel
        ref={emblaRef}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: false,
          containScroll: "trimSnaps",
          duration: 50,
        }}
      >
        <CarouselContent className="-ml-4">
          {nfts.map((nft) => (
            <CarouselItem key={nft.id} className="pl-4 basis-1/2 transition-transform duration-300">
              <NFTCard
                {...nft}
                videoUrl={nft.video_url}
                onPurchase={handlePurchase}
                isPurchased={purchasedNfts?.includes(nft.id) ?? false}
              />
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