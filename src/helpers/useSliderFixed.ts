import React, {useCallback, useEffect, useState, useRef} from 'react';

import {useInterval} from './useInterval';
import useWindowEvent from './useWindowEvent';
import {range} from './range';

export const getSwipeDirection = (start = [], end = [], minSwipe = 0) => {
  const [x1, y1] = start;
  const [x2, y2] = end;

  const xDist = x1 - x2;
  const yDist = y1 - y2;

  if (isNaN(xDist) || isNaN(yDist) || Math.abs(xDist) < minSwipe) {
    return 0;
  }

  const r = Math.atan2(yDist, xDist);
  let swipeAngle = Math.round((r * 180) / Math.PI);

  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  if (swipeAngle <= 45 && swipeAngle >= 0) {
    return 1;
  }
  if (swipeAngle <= 360 && swipeAngle >= 315) {
    return 1;
  }
  if (swipeAngle >= 135 && swipeAngle <= 225) {
    return -1;
  }

  return 0;
};

// @ts-ignore
function getTouchPos(event) {
  const {touches, clientX, clientY} = event;
  const {pageX: x = clientX, pageY: y = clientY} = touches ? touches[0] : {};

  return [x, y];
}

export default function useSliderFixed(
  children?: React.ReactNode,
  settings: any = {}
) {
  const totalSlides = React.Children.count(children);

  const {
    autoplay,
    autoplaySpeed,
    easing,
    fade,
    initialSlide,
    pauseOnHover,
    responsive,
    showArrows,
    showDots,
    slidesToScroll,
    slidesToShow,
    speed,
    touchMove,
    touchThreshold,
    zIndex
  } = {...defaults, ...settings};

  const [dots, setDots] = useState([]);
  const [touchStartPos, setTouchStartPos] = useState([]);
  const [touchEndPos, setTouchEndPos] = useState([]);
  const [index, setIndex] = useState(
    initialSlide < totalSlides ? initialSlide : 0
  );
  const [initialized, setInitialized] = useState(0);
  const [minSwipe, setMinSwipe] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slides, setSlides] = useState<any>(null);
  const [itemsToShow, setItemsToShow] = useState(slidesToShow);
  const [itemsToScroll, setItemsToScroll] = useState(slidesToScroll);
  const [slideWidth, setSlideWidth] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const transition = `${fade ? 'opacity' : 'transform'} ${speed}ms ${easing}`;

  const onPause = useCallback(() => {
    setPaused(true);
  }, []);

  const onPlay = useCallback(() => {
    setPaused(false);
  }, []);

  const onPrev = useCallback(() => {
    const prevIndex =
      index - itemsToScroll < 0
        ? totalSlides -
          (itemsToScroll > 1 ? totalSlides % itemsToScroll : itemsToScroll)
        : index - itemsToScroll;

    setIndex(prevIndex);
  }, [index, itemsToScroll, totalSlides]);

  const onNext = useCallback(() => {
    const nextIndex =
      index + itemsToScroll >= totalSlides ? 0 : index + itemsToScroll;

    setIndex(nextIndex);
  }, [index, itemsToScroll, totalSlides]);

  // @ts-ignore
  const onSwipeStart = useCallback((e) => {
    // @ts-ignore
    setTouchStartPos(getTouchPos(e));
    setPaused(true);
  }, []);

  // @ts-ignore
  const onSwipeMove = useCallback((e) => {
    // @ts-ignore
    setTouchEndPos(getTouchPos(e));
  }, []);

  const onSwipeEnd = useCallback(() => {
    const direction = getSwipeDirection(touchStartPos, touchEndPos, minSwipe);

    if (direction > 0) {
      onNext();
    } else if (direction < 0) {
      onPrev();
    }

    setTouchStartPos([]);
    setTouchEndPos([]);
    setPaused(false);
  }, [minSwipe, onNext, onPrev, touchEndPos, touchStartPos]);

  const touchEvents = touchMove
    ? {
        onMouseDown: onSwipeStart,
        onMouseMove: onSwipeMove,
        onMouseUp: onSwipeEnd,
        onMouseLeave: onSwipeEnd,
        onTouchStart: onSwipeStart,
        onTouchMove: onSwipeMove,
        onTouchEnd: onSwipeEnd,
        onTouchCancel: onSwipeEnd
      }
    : {};

  const onResize = useCallback(() => {
    const sliderElem = sliderRef.current;
    const trackElem = trackRef.current;
    const listElem = listRef.current;

    // @ts-ignore
    const listWidth = listElem?.offsetWidth || 0;
    // @ts-ignore
    const sliderWidth = sliderElem?.offsetWidth || 0;

    if (!isNaN(touchThreshold) && touchThreshold > 0) {
      setMinSwipe(listWidth / touchThreshold);
    }

    let trackWidth = 0;

    if (fade) {
      setSlideWidth(sliderWidth);
      trackWidth = sliderWidth * totalSlides;
    } else {
      let width = sliderWidth / slidesToShow;

      if (responsive) {
        const breakpointKey = Object.keys(responsive)
          .reverse()
          .find((bp: any) => parseInt(bp) < sliderWidth);

        // @ts-ignore
        const breakpoint = responsive[breakpointKey];

        if (breakpoint) {
          const {slidesToShow, slidesToScroll} = breakpoint;
          width = sliderWidth / slidesToShow;
          setItemsToShow(slidesToShow);
          setItemsToScroll(slidesToScroll);
        }
      }

      width = Math.floor(width);
      setSlideWidth(width);
      trackWidth = width * totalSlides;
    }

    // @ts-ignore
    if (trackElem) trackElem.style.width = `${trackWidth}px`;
  }, [fade, responsive, slidesToShow, totalSlides, touchThreshold]);

  useWindowEvent('resize', onResize, 0, true);

  // @ts-ignore
  useInterval(onNext, autoplay ? (paused ? null : autoplaySpeed) : null);

  useEffect(() => {
    // @ts-ignore
    function cloneSlide(slide, {active, current, style}) {
      const {className, ...childProps} = slide.props;

      const classes = [className, 'slick-slide'];
      if (active) classes.push('slick-active');
      if (current) classes.push('slick-current');

      const slideProps = {
        'aria-hidden': !active,
        className: classes.join(' '),
        role: 'option',
        style,
        tabIndex: -1
      };

      return React.cloneElement(slide, {...slideProps, ...childProps});
    }

    const slidesArray = React.Children.map(children, (slide, i) => {
      const current = i === index;

      let active;
      let style;

      if (fade) {
        active = current;

        style = {
          left: i === 0 ? 0 : -(slideWidth * i),
          opacity: current ? 1 : 0.25,
          position: 'relative',
          top: 0,
          transition: current ? transition : 'none',
          zIndex: current ? zIndex + totalSlides + 10 : zIndex + i
        };
      } else {
        active = i >= index && index + itemsToShow > i;

        let xPos = -slideWidth * index;

        style = {
          transition: transition,
          transform: `translate3d(${xPos}px, 0, 0)`
        };
      }

      return cloneSlide(slide, {
        active,
        current,
        style: {width: slideWidth, ...style}
      });
    });

    setSlides(slidesArray || null);

    setDots(
      // @ts-ignore
      range(1, totalSlides).map((label, key) => ({
        active: key === index,
        key,
        label: `${label}`,
        onClick: () => setIndex(key)
      }))
    );

    // @ts-ignore
    if (!initialized) setInitialized(true);
  }, [
    children,
    fade,
    index,
    initialized,
    itemsToShow,
    onPause,
    onPlay,
    pauseOnHover,
    slideWidth,
    totalSlides,
    transition,
    zIndex
  ]);

  useEffect(() => {
    if (!pauseOnHover || !initialized || !trackRef.current) return;

    const track = trackRef.current;
    let isMouseInside = false;

    const handleMouseEnter = (e: any) => {
      const target = e.target as HTMLElement;

      // Ignore hover over controls (arrows)
      if (target.closest('.c-carousel__controls')) {
        return;
      }

      const activeSlide = target.closest('.slick-active');

      if (activeSlide && !isMouseInside) {
        isMouseInside = true;
        onPause();
      }
    };

    const handleMouseLeave = (e: any) => {
      const relatedTarget = e.relatedTarget as HTMLElement;

      // Check if we're leaving the entire track
      if (!track.contains(relatedTarget) && isMouseInside) {
        isMouseInside = false;
        onPlay();
      }
    };

    track.addEventListener('mouseenter', handleMouseEnter, true);
    track.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      track.removeEventListener('mouseenter', handleMouseEnter, true);
      track.removeEventListener('mouseleave', handleMouseLeave);
      isMouseInside = false;
    };
  }, [initialized, onPause, onPlay, pauseOnHover]);

  return {
    dots,
    initialized,
    listRef,
    onNext,
    onPause,
    onPlay,
    onPrev,
    showArrows,
    showDots,
    sliderRef,
    slides,
    touchEvents,
    trackRef
  };
}

const defaults = {
  autoplay: true,
  autoplaySpeed: 4000,
  easing: 'ease-out',
  fade: false,
  infinite: true,
  initialSlide: 0,
  pauseOnHover: true,
  showArrows: true,
  showDots: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 300,
  touchMove: true,
  touchThreshold: 11,
  zIndex: 1000
};
