import { useEffect } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/dist/photoswipe.css'

export default function Gallery({ images, galleryId = 'gallery' }) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()

    return () => lightbox.destroy()
  }, [galleryId])

  return (
    <div id={galleryId} className="columns-2 md:columns-3 gap-4 space-y-4">
      {images.map((img, idx) => (
        <div key={idx} className="break-inside-avoid relative group">
          <a
            href={img.fullSrc}
            data-pswp-width={img.width}
            data-pswp-height={img.height}
            className="block overflow-hidden rounded-md bg-gray-100"
          >
            <img
              src={img.thumbSrc.src}
              alt={img.caption}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </a>
          <div className="mt-2 text-sm text-gray-600 text-center">
            {img.caption}
          </div>
        </div>
      ))}
    </div>
  )
}
