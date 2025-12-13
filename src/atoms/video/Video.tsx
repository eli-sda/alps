import React, {useEffect, useRef} from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface VideoProps {
  src: string;
  width?: number;
  height?: number;
  onEnded?: () => void;
  isVisible?: boolean;
}

export const Video = ({
  src,
  width,
  height,
  onEnded,
  isVisible
}: VideoProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const wasPausedByUsRef = useRef<boolean>(false);
  const onEndedRef = useRef(onEnded);

  // Keep onEnded ref up to date
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // Determine if we should use YouTube API
  const useYouTubeAPI = onEnded !== undefined || isVisible !== undefined; // Check if src has autoplay=1 query param
  const shouldAutoplay = src.includes('autoplay=1');

  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
  };

  // Handle visibility changes - pause/play video
  useEffect(() => {
    if (!useYouTubeAPI || !playerRef.current) return;

    if (isVisible === false) {
      // Dialog closed - pause the video
      const state = playerRef.current.getPlayerState?.();
      if (state === 1) {
        // PLAYING
        playerRef.current.pauseVideo();
        wasPausedByUsRef.current = true;
      }
    } else if (isVisible === true) {
      // Dialog opened - resume if we paused it
      if (wasPausedByUsRef.current) {
        playerRef.current.playVideo();
        wasPausedByUsRef.current = false;
      }
    }
  }, [isVisible, useYouTubeAPI]);

  // Initialize YouTube player once
  useEffect(() => {
    // Use YouTube API if we need onEnded callback OR visibility control
    if (!useYouTubeAPI) return;

    const videoId = getVideoId(src);
    if (!videoId) return;

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (containerRef.current && !playerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: shouldAutoplay && isVisible !== false ? 1 : 0,
            rel: 0
          },
          events: {
            onStateChange: (event: any) => {
              if (event.data === 0) {
                // YT.PlayerState.ENDED
                onEndedRef.current?.();
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useYouTubeAPI]);

  // Handle video changes
  useEffect(() => {
    if (!playerRef.current || !playerRef.current.loadVideoById) return;

    const videoId = getVideoId(src);
    if (!videoId) return;

    playerRef.current.loadVideoById(videoId);
  }, [src]);

  // If onEnded or isVisible is provided, use the div container for YouTube API
  // Otherwise, use the standard iframe
  if (useYouTubeAPI) {
    return (
      <div>
        <div
          ref={containerRef}
          style={{aspectRatio: '16 / 9', width: width || '100%'}}
        />
      </div>
    );
  }

  return (
    <div>
      <iframe
        style={{aspectRatio: '16 / 9'}}
        title="YouTube video player"
        src={src}
        width={width}
        height={height}
        allowFullScreen
        allow={shouldAutoplay ? 'autoplay' : undefined}
      />
    </div>
  );
};
