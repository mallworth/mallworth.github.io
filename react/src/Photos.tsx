import { useMemo, useRef, useEffect } from 'react'

export default function Photos() {
  const baseUrl = import.meta.env.BASE_URL
  const trackRef = useRef<HTMLDivElement>(null)

  const items = useMemo(
    () => [
      { src: `${baseUrl}photos/1.jpg` },
      { src: `${baseUrl}photos/2.jpg` },
      { src: `${baseUrl}photos/3.jpg` },
    ],
    [baseUrl]
  )

  // 2 copies: the track scrolls exactly one set's width, then resets invisibly
  const loopItems = useMemo(() => [...items, ...items], [items])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      // The first N children are "copy 1" — measure their combined width including gaps
      const children = Array.from(track.children) as HTMLElement[]
      const half = children.slice(0, items.length)
      if (!half.length) return

      const first = half[0].getBoundingClientRect()
      const last = half[half.length - 1].getBoundingClientRect()
      const totalWidth = last.right - first.left

      track.style.setProperty('--scroll-width', `${totalWidth}px`)
    }

    // Measure after images load for accurate sizes
    const images = Array.from(track.querySelectorAll('img'))
    let loaded = 0
    const onLoad = () => {
      loaded++
      if (loaded === images.length) measure()
    }

    images.forEach(img => {
      if (img.complete) { loaded++; }
      else img.addEventListener('load', onLoad)
    })
    if (loaded === images.length) measure()

    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [items.length])

  return (
    <main className="slider-page">
      <section className="carousel" aria-label="Photo carousel">
        <div className="carousel-track" ref={trackRef}>
          {loopItems.map((item, index) => (
            <div className="carousel-item" key={`${item.src}-${index}`}>
              <img className="carousel-image" src={item.src} alt="" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}