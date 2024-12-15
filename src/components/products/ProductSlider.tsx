import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";

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

const ProductSlider = () => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    console.log('Setting up product carousel rotation');

    const rotateSlide = () => {
      if (current === products.length - 1) {
        api.scrollTo(0);
        setCurrent(0);
      } else {
        api.scrollTo(current + 1);
        setCurrent(prev => prev + 1);
      }
      console.log('Rotating to next product slide:', current);
    };

    let intervalId = setInterval(rotateSlide, 3000);
    console.log('Initial product interval set');

    const handleInteraction = () => {
      console.log('User interaction detected on product slider');
      setCurrent(api.selectedScrollSnap());
      clearInterval(intervalId);
      intervalId = setInterval(rotateSlide, 3000);
      console.log('Product interval reset after user interaction');
    };

    api.on('select', handleInteraction);

    return () => {
      console.log('Cleaning up product carousel effects');
      clearInterval(intervalId);
      api.off('select', handleInteraction);
    };
  }, [api, current]);

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
};

export default ProductSlider;