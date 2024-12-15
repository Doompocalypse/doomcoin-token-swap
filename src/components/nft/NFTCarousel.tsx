import React, { useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NFTCard from './NFTCard';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useToast } from "@/components/ui/use-toast";

interface NFT {
  id: string;
  name: string;
  description: string | null;
  price: number;
  video_url: string;
}

const NFTCarousel = ({ connectedAccount }: { connectedAccount?: string }) => {
  const { toast } = useToast();
  
  // Initialize autoplay plugin with configuration
  const autoplayOptions = {
    delay: 3000,
    stopOnInteraction: false,
    rootNode: (emblaRoot: any) => emblaRoot.parentElement,
  };
  
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 2 }, 
    [Autoplay(autoplayOptions)]
  );

  const { data: nfts } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mock_nfts')
        .select('*');
      
      if (error) throw error;
      return data as NFT[];
    }
  });

  const { data: purchasedNfts } = useQuery({
    queryKey: ['purchased_nfts', connectedAccount],
    queryFn: async () => {
      if (!connectedAccount) return [];
      const { data, error } = await supabase
        .from('mock_purchases')
        .select('nft_id')
        .eq('buyer_address', connectedAccount);
      
      if (error) throw error;
      return data.map(purchase => purchase.nft_id);
    },
    enabled: !!connectedAccount
  });

  const handlePurchase = async (nftId: string) => {
    if (!connectedAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase NFTs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('mock_purchases')
        .insert([
          { nft_id: nftId, buyer_address: connectedAccount }
        ]);

      if (error) throw error;

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased this NFT!",
      });
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!nfts) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Carousel
        ref={emblaRef}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          {nfts.map((nft) => (
            <CarouselItem key={nft.id} className="pl-4 basis-1/2">
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