import React, { memo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NFTCard from './NFTCard';
import { useRealNFTData } from '@/hooks/useRealNFTData';
import { useNFTPurchaseHandler } from './NFTPurchaseHandler';
import { useCarouselRotation } from '@/hooks/useCarouselRotation';

interface NFTCarouselProps {
  connectedAccount?: string;
  onInsufficientBalance?: () => void;
}

const NFTCarousel = memo(({ connectedAccount, onInsufficientBalance }: NFTCarouselProps) => {
  const { nfts, purchasedNfts, nftsError } = useRealNFTData(connectedAccount);
  const { handlePurchase } = useNFTPurchaseHandler(connectedAccount, onInsufficientBalance);
  const { setApi } = useCarouselRotation({ 
    itemsLength: nfts?.length || 0,
    name: 'nft-carousel'
  });

  // Sort NFTs by price if they exist
  const sortedNfts = nfts?.sort((a, b) => a.price - b.price);
  
  console.log('NFTCarousel render - nfts:', sortedNfts);

  if (nftsError) {
    console.error('Error loading NFTs:', nftsError);
    return (
      <div className="text-white text-center p-4">
        <p className="text-xl font-semibold mb-2">Error loading NFTs</p>
        <p className="text-gray-400">Please check your network connection and try again later.</p>
      </div>
    );
  }
  
  if (!sortedNfts || sortedNfts.length === 0) {
    return (
      <div className="text-white text-center p-4">
        <p className="text-xl">Loading NFTs...</p>
      </div>
    );
  }

  const handleNFTPurchase = (nft: any) => {
    // Generate a transaction hash for the purchase
    const txHash = `purchase_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    handlePurchase(nft.id, nft.price, txHash);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 relative">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {sortedNfts.map((nft) => (
            <CarouselItem key={nft.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <NFTCard
                  {...nft}
                  onPurchase={() => handleNFTPurchase(nft)}
                  isPurchased={purchasedNfts?.includes(nft.id)}
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
});

NFTCarousel.displayName = 'NFTCarousel';

export default NFTCarousel;