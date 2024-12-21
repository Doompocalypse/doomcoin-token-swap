interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => (
  <iframe
    src={`${videoUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
    className="w-full h-full"
    allow="autoplay; fullscreen"
    frameBorder="0"
  />
);

export default VideoPlayer;