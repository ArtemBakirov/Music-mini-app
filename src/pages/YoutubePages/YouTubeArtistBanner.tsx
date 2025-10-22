export const YouTubeArtistBanner = ({
  videoId,
  className = "",
}: {
  videoId: string;
  className?: string;
}) => {
  // loop requires playlist=<same videoId> when controls are hidden
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&enablejsapi=0`;
  return (
    <iframe
      title="channel-trailer"
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${className}`}
      src={src}
      allow="autoplay; encrypted-media; picture-in-picture"
      frameBorder="0"
      // important for iOS
      allowFullScreen={false}
    />
  );
};
