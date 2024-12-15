interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => (
  <div className="p-4 pb-2">
    <div className="aspect-video w-full">
      <iframe
        src={`${videoUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
        className="w-full h-full"
        allow="autoplay; fullscreen"
        frameBorder="0"
      />
    </div>
  </div>
);

export default VideoPlayer;