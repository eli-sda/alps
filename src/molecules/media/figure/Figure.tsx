import React, {useMemo} from 'react';
import {Video} from '../../../atoms/video/Video';
import {Figcaption} from '../figcaption/Figcaption';
import {Picture} from '../../../atoms/images/Picture';
import {
  figureAlignPositionsMap,
  figureSizesMap,
  getFigureClasses
} from '../../../global/figures';
import {ImageType} from '../../../atoms/images/ImageType';

export interface FigureProps {
  /**
   * Click handler for the figure (e.g. for thumbnails)
   */
  onImageClick?: React.MouseEventHandler<HTMLDivElement>;
  /**
   * Specify the caption of your  Figure
   */
  caption?: string | JSX.Element;
  /**
   * Specify the align of your  Figure
   */
  align?: keyof typeof figureAlignPositionsMap;
  /**
   * Specify the className of your  Figure
   */
  className?: string;
  image?: ImageType;
  /**
   * Specify whether the Figure should be an lazy variant
   */
  lazy?: boolean;
  /**
   * Specify the size of your  Figure
   */
  size?: keyof typeof figureSizesMap;
  /**
   * Specify the videoSrc of your  Figure
   */
  videoSrc?: string;
  /**
   * Callback when video ends
   */
  onVideoEnded?: () => void;
  /**
   * Control video visibility (pause when hidden)
   */
  isVisible?: boolean;
}

export const Figure = ({
  caption,
  className = '',
  image,
  lazy = false,
  videoSrc,
  align,
  size,
  onVideoEnded,
  isVisible,
  onImageClick
}: FigureProps): JSX.Element => {
  const classes = useMemo(
    () => (align && size ? getFigureClasses(align, size) : ''),
    [align, size]
  );

  return (
    <figure className={`o-figure ${classes} ${className}`}>
      {image && (
        <div
          className="o-figure__image"
          onClick={onImageClick}
          style={onImageClick ? {cursor: 'pointer'} : undefined}
        >
          <Picture image={image} lazy={lazy} />
        </div>
      )}
      {videoSrc && (
        <div className="u-image--wrap">
          <Video src={videoSrc} onEnded={onVideoEnded} isVisible={isVisible} />
        </div>
      )}
      {caption && (
        <div className="o-figure__caption">
          <Figcaption>{caption}</Figcaption>
        </div>
      )}
    </figure>
  );
};
