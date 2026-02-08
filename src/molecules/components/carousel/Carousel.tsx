import React from "react";
import {IconWrap} from "../../../atoms/icons/IconWrap";
import {Slide, SlideProps} from "../slide/Slide";
import {Slider} from "./Slider";

const sliderSettings = {
    fade: true,
    touchThreshold: 11,
    dots: true,
    adaptiveHeight: true,
}

export interface CarouselArrowsProps {
    onNext?: () => void,
    onPrev?: () => void,
}

export const CarouselArrows = ({onNext, onPrev}: CarouselArrowsProps): JSX.Element => {
    return (
        <div className="c-carousel__controls">
      <span className="o-arrow__prev" onClick={onPrev}>
        <IconWrap
            background= {"darker"}
            color="white"
            className="c-carousel__arrow c-carousel__arrow--prev u-round"
            name="arrow-bracket-left"
            size="s"
        />
      </span>
            <span className="o-arrow__next" onClick={onNext}>
        <IconWrap
            background={"darker"}
            color="white"
            className="c-carousel__arrow c-carousel__arrow--next u-round"
            name="arrow-bracket-right"
            size="s"
        />
      </span>
        </div>
    )
}

/**
 * autoplaySpeed: number (optional) - specify the autoplay speed in milliseconds. Default is 4000ms.
 */
export interface CarouselProps {
    slides?: SlideProps[],
    showArrows?: boolean,
    showDots?: boolean,
    slideComponent?: React.ComponentType<SlideProps>,
    autoplaySpeed?: number,
}


export const Carousel = ({slides = [], showArrows = false, showDots = true, slideComponent: SlideComponent = Slide, autoplaySpeed}: CarouselProps): JSX.Element => {
    const mergedSettings = { ...sliderSettings, ...(typeof autoplaySpeed === 'number' ? { autoplaySpeed } : {}) };
    return (
        <div className="c-carousel u-position--relative">
            <Slider
                arrowsComponent={showArrows ? CarouselArrows : null}
                className="c-carousel__slides"
                showArrows={showArrows}
                showDots={showDots}
                settings={mergedSettings}
            >
                {slides.map((slide, key) => (
                    <SlideComponent {...slide} key={`carousel-slide-${key}`}/>
                ))}
            </Slider>
        </div>
    )
}
