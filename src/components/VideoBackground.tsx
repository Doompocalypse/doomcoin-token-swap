import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="relative w-full h-full">
        <div style={{
          padding: '56.25% 0 0 0',
          position: 'relative'
        }}>
          <iframe
            src="https://player.vimeo.com/video/1039284485?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/50" /> {/* Optional overlay to ensure content remains readable */}
    </div>
  );
};

export default VideoBackground;