import React from 'react'
import { type EmblaOptionsType } from 'embla-carousel'
import {
    PrevBtn,
    NextBtn,
    usePrevNextButtons
} from './CarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'

type PropType = {
    slides: string[]
    options?: EmblaOptionsType
}

const CarouselStory: React.FC<PropType> = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevBtnClick,
        onNextBtnClick,
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((e) => (
                        <div className="embla__slide" key={e}>
                            <div className="size-20 rounded-full bg-linear-to-tr from-[#2e8dfe] to-[#36c49a] relative">
                                <img alt={e} src="https://picsum.photos/100" className="absolute top-1 left-1 size-18 bg-amber-50 rounded-full border-3 border-[#161e2b]" />
                            </div>
                            <p className="text-center w-20">{e}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls">
                <PrevBtn  onClick={onPrevBtnClick} disabled={prevBtnDisabled}>
                    <i className="fa-solid fa-circle-chevron-left cursor-pointer text-2xl"></i>
                </PrevBtn>
                <NextBtn  onClick={onNextBtnClick} disabled={nextBtnDisabled}>
                    <i className="fa-solid fa-circle-chevron-right cursor-pointer text-2xl"></i>
                </NextBtn>
            </div>
        </section>
    )
}

export default CarouselStory
