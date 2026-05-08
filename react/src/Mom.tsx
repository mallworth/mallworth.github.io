import { useMemo, useState } from 'react'

export default function Mom() {
  const baseUrl = import.meta.env.BASE_URL
  const items = useMemo(
    () => [
      { text: 'Dear Mom,' },
      { text: "Happy Mother's Day!" },
      { text: "Thank you for being a supportive," },
      { text: "loving," },
      { text: "strong person." },
      { text: "I am so grateful to have you in my life!" },
      {
        text: "Can't wait to see you soon(ish)",
        link: { href: `${baseUrl}photos/`, label: 'Some photos' }
      }
    ],
    [baseUrl]
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const canAdvance = activeIndex < items.length - 1
  const canGoBack = activeIndex > 0

  const handleNext = () => {
    if (canAdvance) {
      setActiveIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (canGoBack) {
      setActiveIndex((prev) => prev - 1)
    }
  }

  return (
    <main className="slider-page">
      <section className="slider" aria-live="polite">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div className="slide" key={`${item.text}-${index}`}>
              <div className="slide-content">
                <p className="slide-text">{item.text}</p>
                {item.link && (
                  <a className="slide-link" href={item.link.href}>
                    {item.link.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {canGoBack && (
          <button
            className="nav-button nav-left"
            type="button"
            onClick={handlePrev}
            aria-label="Previous"
          >
            <span className="chevron chevron-left" aria-hidden="true" />
          </button>
        )}
        {canAdvance && (
          <button
            className="nav-button nav-right"
            type="button"
            onClick={handleNext}
            aria-label="Next"
          >
            <span className="chevron chevron-right" aria-hidden="true" />
          </button>
        )}
      </section>
    </main>
  )
}
