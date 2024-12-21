import React, { memo } from 'react';
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
import { useCarouselRotation } from '@/hooks/useCarouselRotation';

interface NFTCarouselProps {
  connectedAccount?: string;
  onInsufficientBalance?: () => void;
}

const NFTCarousel = memo(({ connectedAccount, onInsufficientBalance }: NFTCarouselProps) => {
  const { nfts, purchasedNfts } = useNFTData(connectedAccount);
  const handlePurchase = useNFTPurchaseHandler(connectedAccount, onInsufficientBalance);
  const { setApi } = useCarouselRotation({ 
    itemsLength: nfts?.length || 0,
    name: 'nft-carousel'
  });

  console.log('NFTCarousel render - nfts:', nfts);
  console.log('NFTCarousel render - purchasedNfts:', purchasedNfts);

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
              <NFTCard
                {...nft}
                videoUrl={nft.video_url}
                imageUrl={nft.image_url}
                onPurchase={() => handlePurchase(nft.id, nft.price)}
                isPurchased={purchasedNfts?.includes(nft.id) ?? false}
              />
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
});

NFTCarousel.displayName = 'NFTCarousel';

export default NFTCarousel;