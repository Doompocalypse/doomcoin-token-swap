import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect } from 'react';

export const useCarouselConfig = () => {
  const autoplayOptions = {
    delay: 3000,
    stopOnInteraction: false,
    rootNode: (emblaRoot: any) => emblaRoot.parentElement,
  };
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      dragFree: true,
      containScroll: "trimSnaps",
      duration: 50
    }, 
    [Autoplay(autoplayOptions)]
  );

  // Reset autoplay when component mounts or updates
  useEffect(() => {
    if (emblaApi) {
      console.log("Initializing carousel autoplay");
      emblaApi.plugins().autoplay?.reset();
    }
  }, [emblaApi]);

  // Handle autoplay reset on user interaction
  const onInteractionEnd = useCallback(() => {
    if (emblaApi) {
      console.log("Resetting autoplay after interaction");
      emblaApi.plugins().autoplay?.reset();
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      // Using the correct event types from Embla
      emblaApi.on('pointerUp', onInteractionEnd);
      emblaApi.on('settle', onInteractionEnd);
      
      return () => {
        emblaApi.off('pointerUp', onInteractionEnd);
        emblaApi.off('settle', onInteractionEnd);
      };
    }
  }, [emblaApi, onInteractionEnd]);

  return emblaRef;
};