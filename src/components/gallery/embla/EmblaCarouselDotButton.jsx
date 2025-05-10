import React from 'react';


export const DotButton = ({ selected, onClick }) => (
    <button
      className={`w-3 h-3 rounded-full mx-1 ${
        selected ? 'bg-blue-500' : 'bg-gray-300'
      }`}
      onClick={onClick}
    />
  )
  
  export const useDotButton = (emblaApi) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState([])
  
    React.useEffect(() => {
      if (!emblaApi) return
  
      const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
      setScrollSnaps(emblaApi.scrollSnapList())
      emblaApi.on('select', onSelect)
      emblaApi.on('reInit', () => {
        setScrollSnaps(emblaApi.scrollSnapList())
        onSelect()
      })
      onSelect()
    }, [emblaApi])
  
    return {
      selectedIndex,
      scrollSnaps,
      onDotButtonClick: emblaApi ? emblaApi.scrollTo : () => {},
    }
  }
  