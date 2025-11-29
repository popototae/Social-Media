import React, {
    type ComponentPropsWithRef,
    useCallback,
    useEffect,
    useState
} from 'react'
import { type EmblaCarouselType } from 'embla-carousel'

type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean
    nextBtnDisabled: boolean
    onPrevBtnClick: () => void
    onNextBtnClick: () => void
}

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return
        const current = emblaApi.selectedScrollSnap()
        emblaApi.scrollTo(current - 4)
    }, [emblaApi])

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return
        const current = emblaApi.selectedScrollSnap()
        emblaApi.scrollTo(current + 4)
    }, [emblaApi])

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevBtnClick: onPrevButtonClick,
        onNextBtnClick: onNextButtonClick
    }
}

type PropType = ComponentPropsWithRef<'button'>

export const PrevBtn: React.FC<PropType> = (props) => {
    const { children, ...restProps } = props

    return (
        <button
            className="disabled:text-transparent"
            type="button"
            {...restProps}
        >
            {children}
        </button>
    )
}

export const NextBtn: React.FC<PropType> = (props) => {
    const { children, ...restProps } = props

    return (
        <button
            className="disabled:text-transparent"
            type="button"
            {...restProps}
        >
            {children}
        </button>
    )
}
