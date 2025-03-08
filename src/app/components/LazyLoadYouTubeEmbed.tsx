import { useState, useEffect } from 'react';

const LazyLoadYouTubeEmbed = ({ videoId }: { videoId: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // After the component mounts, we allow the iframe to load.
    setIsLoaded(true);
  }, []);

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
      {isLoaded && (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            border: 0,
          }}
        ></iframe>
      )}
    </div>
  );
};

export default LazyLoadYouTubeEmbed;
