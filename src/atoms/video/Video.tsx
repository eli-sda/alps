import React from 'react';

export interface VideoProps {
  src: string;
  width?: number;
  height?: number;
}

export const Video = ({
  src,
  width,
  height
}: VideoProps): JSX.Element => {
  // Check if src has autoplay=1 query param
  const shouldAutoplay = src.includes('autoplay=1');
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
