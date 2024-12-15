import { useState, useEffect } from 'react';

interface CarouselRotationProps {
  itemsLength: number;
  intervalDuration?: number;
  name?: string;
}

export const useCarouselRotation = ({ itemsLength, intervalDuration = 3000, name = 'carousel' }: CarouselRotationProps) => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || !itemsLength) return;

    console.log(`Setting up ${name} rotation`);

    const rotateSlide = () => {
      if (current === itemsLength - 1) {
        api.scrollTo(0);
        setCurrent(0);
      } else {
        api.scrollTo(current + 1);
        setCurrent(prev => prev + 1);
      }
      console.log(`Rotating to next ${name} slide:`, current);
    };

    let intervalId = setInterval(rotateSlide, intervalDuration);
    console.log(`Initial ${name} interval set`);

    const handleInteraction = () => {
      console.log(`User interaction detected on ${name}`);
      setCurrent(api.selectedScrollSnap());
      clearInterval(intervalId);
      intervalId = setInterval(rotateSlide, intervalDuration);
      console.log(`${name} interval reset after user interaction`);
    };

    api.on('select', handleInteraction);

    return () => {
      console.log(`Cleaning up ${name} effects`);
      clearInterval(intervalId);
      api.off('select', handleInteraction);
    };
  }, [api, current, itemsLength, intervalDuration, name]);

  return { api, setApi, current };
};