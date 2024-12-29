import React, { memo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRealNFTData } from '@/hooks/useRealNFTData';
import { useNFTPurchaseHandler } from '@/components/nft/NFTPurchaseHandler';
import { useCarouselRotation } from '@/hooks/useCarouselRotation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Coins } from "lucide-react";

interface ProductSliderProps {
  connectedAccount?: string;
  onInsufficientBalance?: () => void;
}

const ProductSlider = memo(({ connectedAccount, onInsufficientBalance }: ProductSliderProps) => {
  const { nfts, purchasedNfts, nftsError } = useRealNFTData(connectedAccount);
  const { handlePurchase, ReferralDialog } = useNFTPurchaseHandler(connectedAccount, onInsufficientBalance);
  const { setApi } = useCarouselRotation({ 
    itemsLength: nfts?.length || 0,
    name: 'product-slider'
  });

  // Sort NFTs by price if they exist
  const sortedNfts = nfts?.sort((a, b) => a.price - b.price);
  
  console.log('ProductSlider render - nfts:', sortedNfts);

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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 relative">
      {ReferralDialog}
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
                <Card className="w-full max-w-[400px] mx-auto bg-black/40 border-[#8E9196]/20">
                  <AspectRatio ratio={1}>
                    <img 
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </AspectRatio>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">{nft.name}</h3>
                    <p className="text-gray-300 text-sm mb-6">{nft.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-white" />
                        <span className="text-white font-bold">{nft.price} DMC</span>
                      </div>
                      <Button 
                        onClick={() => handlePurchase(nft.id, nft.price)}
                        disabled={purchasedNfts?.includes(nft.id)}
                        className={`${
                          purchasedNfts?.includes(nft.id) 
                            ? 'bg-gray-500' 
                            : 'bg-white hover:bg-white/90'
                        } text-black`}
                      >
                        {purchasedNfts?.includes(nft.id) ? "Owned" : "Mint NFT"}
                      </Button>
                    </div>
                  </div>
                </Card>
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

ProductSlider.displayName = 'ProductSlider';

export default ProductSlider;