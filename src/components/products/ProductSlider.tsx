import React, { memo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import { useCarouselRotation } from '@/hooks/useCarouselRotation';

const products = [
  {
    id: "1",
    name: "Survivor Tier",
    description: "Early access, digital badge (NFT), and exclusive in-game perks",
    videoUrl: "",
    imageUrl: "/lovable-uploads/f461441e-2978-4f00-8198-2e5938a97d5b.png",
    price: 10
  },
  {
    id: "2",
    name: "Strategist Tier",
    description: "All Survivor Tier rewards, plus in-game currency, exclusive faction NFT, and badge perks",
    videoUrl: "",
    imageUrl: "/lovable-uploads/592b8080-ac57-446d-b218-2e9ecc071b98.png",
    price: 100
  },
  {
    id: "3",
    name: "Vanguard Tier",
    description: "All Strategist Tier rewards, plus founding member title, physical merch bundle, exclusive beta access, and premium badge perks",
    videoUrl: "",
    imageUrl: "/lovable-uploads/38239f3c-03f5-4bb0-b193-43e728dadabc.png",
    price: 1000
  },
  {
    id: "4",
    name: "Commander Tier",
    description: "All Vanguard Tier rewards, plus faction leadership NFT, premium merch package, personalized message, and commander badge perks",
    videoUrl: "",
    imageUrl: "/lovable-uploads/4982d180-059b-40a6-beb6-92032eb2a62a.png",
    price: 10000
  },
  {
    id: "5",
    name: "Architect Tier",
    description: "All Commander Tier rewards, plus world builder NFT, private developer roundtable, lifetime VIP access, and architect badge perks",
    videoUrl: "",
    imageUrl: "/lovable-uploads/84deb4fb-7810-4688-8eb5-2dc2827c2dbd.png",
    price: 100000
  },
  {
    id: "6",
    name: "Visionary Tier",
    description: "All Architect Tier rewards, plus co-creator credit NFT, in-game monument NFT, custom merchandise package, and exclusive experience",
    videoUrl: "",
    imageUrl: "/lovable-uploads/8b332fe2-0b91-4907-b27f-ec42ef8ab9c4.png",
    price: 1000000
  }
];

const ProductSlider = memo(() => {
  const { setApi } = useCarouselRotation({ 
    itemsLength: products.length,
    name: 'product-slider'
  });

  console.log('Rendering ProductSlider with products:', products);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <ProductCard {...product} />
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