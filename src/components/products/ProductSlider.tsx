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
    name: "Anubis Guardian",
    description: "Ancient protector of the digital realm, granting enhanced security features.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    imageUrl: "/lovable-uploads/d89c3541-c973-4fc0-9fe9-7adf6ad0a40c.png",
    price: 299.99
  },
  {
    id: "2",
    name: "Horus Overseer",
    description: "All-seeing deity NFT that provides strategic advantages and rare item drops.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    imageUrl: "/lovable-uploads/b782cb08-ff38-49a9-a223-199ae309434f.png",
    price: 199.99
  },
  {
    id: "3",
    name: "Ra's Blessing",
    description: "Sun god's power enhancing gameplay mechanics and resource generation.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    imageUrl: "/lovable-uploads/f8c3764a-5c61-450a-8fff-4f7daf9d6b24.png",
    price: 149.99
  },
  {
    id: "4",
    name: "Osiris Judge",
    description: "Underworld ruler providing exclusive access to special game modes.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    imageUrl: "/lovable-uploads/6dd04cea-cba0-44b0-895a-8f621da2695f.png",
    price: 399.99
  },
  {
    id: "5",
    name: "Isis Enchantress",
    description: "Magical deity offering enhanced crafting and spell-casting abilities.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    imageUrl: "/lovable-uploads/97c7a9ea-bec9-4213-b473-ef285882518d.png",
    price: 299.99
  },
  {
    id: "6",
    name: "Thoth's Wisdom",
    description: "Knowledge keeper providing strategic insights and bonus experience.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    imageUrl: "/lovable-uploads/0c37c47b-cfd2-4cc0-9cbe-c285a6d4ff34.png",
    price: 249.99
  }
].sort((a, b) => a.price - b.price);

const ProductSlider = memo(() => {
  const { setApi } = useCarouselRotation({ 
    itemsLength: products.length,
    name: 'product-slider'
  });

  console.log('Rendering ProductSlider with sorted products:', products);

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