import React from 'react';

export interface VideoProps {
  src: string;
  width?: number;
  height?: number;
  title?: string;
}

export const Video = ({
  src,
  width,
  height,
  title = 'title'
}: VideoProps): JSX.Element => {
  return (
    <div>
      <iframe
        title={title}
        src={src}
        width={width}
        height={height}
        allowFullScreen
      />
    </div>
  );
};
