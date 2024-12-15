import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export const useCarouselConfig = () => {
  const autoplayOptions = {
    delay: 3000,
    stopOnInteraction: false,
    rootNode: (emblaRoot: any) => emblaRoot.parentElement,
  };
  
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start", 
      slidesToScroll: 1,
      dragFree: false,
      containScroll: "trimSnaps",
      skipSnaps: false,
      duration: 50,
    }, 
    [Autoplay(autoplayOptions)]
  );

  return emblaRef;
};