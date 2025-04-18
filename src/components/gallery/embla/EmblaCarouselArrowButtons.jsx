import React from 'react';


export const PrevButton = ({ enabled, onClick }) => (
    <button
      className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition disabled:opacity-50"
      onClick={onClick}
      disabled={!enabled}
    >
      ◀
    </button>
  )
  
  export const NextButton = ({ enabled, onClick }) => (
    <button
      className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition disabled:opacity-50"
      onClick={onClick}
      disabled={!enabled}
    >
      ▶
    </button>
  )
  
  export const usePrevNextButtons = (emblaApi) => {
    const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false)
    const [nextBtnEnabled, setNextBtnEnabled] = React.useState(false)
  
    const onSelect = React.useCallback(() => {
      if (!emblaApi) return
      setPrevBtnEnabled(emblaApi.canScrollPrev())
      setNextBtnEnabled(emblaApi.canScrollNext())
    }, [emblaApi])
  
    React.useEffect(() => {
      if (!emblaApi) return
      onSelect()
      emblaApi.on('select', onSelect)
      emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])
  
    return {
      prevBtnEnabled,
      nextBtnEnabled,
      onPrevButtonClick: () => emblaApi.scrollPrev(),
      onNextButtonClick: () => emblaApi.scrollNext(),
    }
  }
  