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
    name: "Quantum Combat Suit",
    description: "Advanced armor with integrated AI assistance and stealth capabilities.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    price: 299.99
  },
  {
    id: "2",
    name: "Neural Interface Kit",
    description: "Direct brain-computer interface for enhanced reaction times.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    price: 199.99
  },
  {
    id: "3",
    name: "Nano-Med Pack",
    description: "Emergency medical nanobots for rapid healing and recovery.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    price: 149.99
  },
  {
    id: "4",
    name: "Plasma Shield Generator",
    description: "Personal force field generator for ultimate protection.",
    videoUrl: "https://player.vimeo.com/video/1039284485",
    price: 399.99
  }
];

const ProductSlider = memo(() => {
  const { setApi } = useCarouselRotation({ 
    itemsLength: products.length,
    name: 'product-slider'
  });

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