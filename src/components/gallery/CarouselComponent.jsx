import React, { useEffect, useState, useCallback, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/dist/photoswipe.css'

export default function Gallery({ images, galleryId = 'gallery' }) {
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true }, [Fade()])
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const totalImages = images.length

  const scrollTo = useCallback(
    (index) => {
      if (!mainApi || !thumbApi) return
      mainApi.scrollTo(index)
      thumbApi.scrollTo(index)
    },
    [mainApi, thumbApi]
  )

  // Sync main carousel to thumbnail click
  useEffect(() => {
    if (!mainApi || !thumbApi) return

    const onSelect = () => {
      const index = mainApi.selectedScrollSnap()
      setSelectedIndex(index)
      thumbApi.scrollTo(index)
    }

    mainApi.on('select', onSelect)
    mainApi.on('reInit', onSelect)
  }, [mainApi, thumbApi])

  // PhotoSwipe lightbox
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()
    return () => lightbox.destroy()
  }, [galleryId])

  const prevImage = () => {
    if (!mainApi) return
    mainApi.scrollPrev()
  }

  const nextImage = () => {
    if (!mainApi) return
    mainApi.scrollNext()
  }

  return (
    <div className="w-full space-y-4">
      {/* Main carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={mainRef}>
          <div className="flex">
            {images.map((img, idx) => (
              <div className="flex-shrink-0 w-full relative" key={idx}>
                <a
                  href={img.fullSrc}
                  data-pswp-width={img.width}
                  data-pswp-height={img.height}
                  className="block aspect-[3/2] bg-gray-100 rounded-md overflow-hidden"
                >
                  <img
                    src={img.fullSrc}
                    alt=""
                    className="object-contain w-full h-full"
                    loading="lazy"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Main arrows */}
        <div className="absolute inset-0 flex justify-between items-center px-2">
          <button
            onClick={prevImage}
            className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition disabled:opacity-50"
          >
            ◀
          </button>
          <button
            onClick={nextImage}
            className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Thumbnail carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={thumbRef}>
          <div className="flex">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-24 aspect-[3/2] mr-2 cursor-pointer relative"
              >
                <button
                  onClick={() => scrollTo(idx)}
                  className={`block border-2 rounded-md w-full h-full transition-all duration-300 ${
                    idx === selectedIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img.thumbSrc.src}
                    alt=""
                    className="object-contain w-full h-full rounded-md"
                    loading="lazy"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail arrows */}
        {/* <div className="absolute inset-0 flex justify-between items-center px-2">
          <button
            onClick={() => {
              if (!thumbApi) return
              thumbApi.scrollPrev()
            }}
            className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition disabled:opacity-50"
          >
            ◀
          </button>
          <button
            onClick={() => {
              if (!thumbApi) return
              thumbApi.scrollNext()
            }}
            className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition disabled:opacity-50"
          >
            ▶
          </button>
        </div> */}
      </div>
    </div>
  )
}
