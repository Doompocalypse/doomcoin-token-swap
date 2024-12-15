import { useState, useEffect, useCallback } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

interface CarouselRotationProps {
  itemsLength: number;
  intervalDuration?: number;
  name?: string;
}

export const useCarouselRotation = ({ 
  itemsLength, 
  intervalDuration = 3000, 
  name = 'carousel' 
}: CarouselRotationProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  const rotateSlide = useCallback(() => {
    if (!api || !itemsLength) return;
    
    if (current === itemsLength - 1) {
      api.scrollTo(0);
      setCurrent(0);
    } else {
      api.scrollTo(current + 1);
      setCurrent(prev => prev + 1);
    }
    console.log(`Rotating to next ${name} slide:`, current);
  }, [api, current, itemsLength, name]);

  useEffect(() => {
    if (!api || !itemsLength) return;

    console.log(`Setting up ${name} rotation`);
    let intervalId: NodeJS.Timeout | null = setInterval(rotateSlide, intervalDuration);

    const handleInteraction = () => {
      console.log(`User interaction detected on ${name}`);
      setCurrent(api.selectedScrollSnap());
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = setInterval(rotateSlide, intervalDuration);
        console.log(`${name} interval reset after user interaction`);
      }
    };

    api.on('select', handleInteraction);

    return () => {
      console.log(`Cleaning up ${name} effects`);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      api.off('select', handleInteraction);
    };
  }, [api, itemsLength, intervalDuration, name, rotateSlide]);

  return { api, setApi, current };
};