import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const VideoBackground = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10 overflow-hidden">
      <div className="absolute inset-0">
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200vw', // Increased width to ensure coverage
          height: '200vh', // Increased height to ensure coverage
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden'
        }}>
          <iframe
            src="https://player.vimeo.com/video/1039284485?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: `translate(-50%, -50%) scale(${isMobile ? 1.75 : 1.25})`, // Different scale for mobile and desktop
              pointerEvents: 'none',
              objectFit: 'cover'
            }}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};

export default VideoBackground;