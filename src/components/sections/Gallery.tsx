'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Play, Pause, X } from 'lucide-react'
import { GALLERY_PHOTOS, type GalleryPhoto } from '@/lib/content'

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const filmstripRef = useRef<HTMLDivElement>(null)
  const activeThumbRef = useRef<HTMLButtonElement>(null)

  const totalPhotos = GALLERY_PHOTOS.length
  const currentPhoto: GalleryPhoto = GALLERY_PHOTOS[currentIndex] ?? GALLERY_PHOTOS[0]!

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalPhotos - 1 : prev - 1))
  }, [totalPhotos])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalPhotos - 1 ? 0 : prev + 1))
  }, [totalPhotos])

  const selectPhoto = (index: number) => {
    setCurrentIndex(index)
  }

  // Autoplay functionality
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      handleNext()
    }, 4500)
    return () => clearInterval(timer)
  }, [isPlaying, handleNext])

  const isFirstRender = useRef(true)

  // Scroll active thumbnail horizontally inside its container only (sin mover la ventana)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (activeThumbRef.current && filmstripRef.current) {
      const container = filmstripRef.current
      const thumb = activeThumbRef.current
      const scrollLeft = thumb.offsetLeft - container.clientWidth / 2 + thumb.clientWidth / 2

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      })
    }
  }, [currentIndex])

  // Keyboard navigation (se ignora mientras la persona escribe en un campo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext, isLightboxOpen])

  // Touch swipe handling
  const minSwipeDistance = 50
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null
    touchStartX.current = e.targetTouches[0]?.clientX ?? null
  }
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0]?.clientX ?? null
  }
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const distance = touchStartX.current - touchEndX.current
    if (distance > minSwipeDistance) handleNext()
    if (distance < -minSwipeDistance) handlePrev()
  }

  return (
    <section id="galeria" className="section">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">Galería Fotográfica Barrial</h2>
          <p className="section-desc">
            22 capturas fotográficas editadas que retratan la pasión, la tierra y la vida cotidiana en las canchas de
            Arica.
          </p>
        </header>

        {/* 2. Marco Principal del Carrusel */}
        <div className="carousel-main-container">
          {/* Barra superior de controles del carrusel */}
          <div className="carousel-top-bar">
            <div className="carousel-counter-badge">
              <span className="counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="counter-separator">/</span>
              <span className="counter-total">{String(totalPhotos).padStart(2, '0')}</span>
              <span className="counter-tag">• {currentPhoto.tag}</span>
            </div>

            <div className="carousel-tools">
              <button
                type="button"
                className={`carousel-tool-btn ${isPlaying ? 'active' : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pausar reproducción automática' : 'Iniciar reproducción automática'}
                aria-label={isPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                <span>{isPlaying ? 'Pausar' : 'Auto'}</span>
              </button>

              <button
                type="button"
                className="carousel-tool-btn"
                onClick={() => setIsLightboxOpen(true)}
                title="Ver en pantalla completa"
                aria-label="Abrir imagen en pantalla completa"
              >
                <Maximize2 size={16} />
                <span>Ampliar</span>
              </button>
            </div>
          </div>

          {/* Visor de Imagen Principal */}
          <div
            className="carousel-viewport"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentPhoto.src}
              alt={currentPhoto.title}
              className="carousel-active-image"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Flecha Izquierda */}
            <button
              type="button"
              className="carousel-nav-btn prev-btn"
              onClick={handlePrev}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Flecha Derecha */}
            <button
              type="button"
              className="carousel-nav-btn next-btn"
              onClick={handleNext}
              aria-label="Foto siguiente"
            >
              <ChevronRight size={28} />
            </button>

            {/* Pie de foto */}
            <div className="carousel-caption-overlay">
              <h3 className="caption-title">{currentPhoto.title}</h3>
              <p className="caption-desc">{currentPhoto.caption}</p>
            </div>
          </div>

          {/* 3. Tira de Miniaturas (Filmstrip) */}
          <div className="filmstrip-wrapper">
            <div className="filmstrip-scroll" ref={filmstripRef} tabIndex={0} aria-label="Tira de miniaturas de fotos">
              {GALLERY_PHOTOS.map((photo, index) => {
                const isActive = index === currentIndex
                return (
                  <button
                    key={photo.id}
                    ref={isActive ? activeThumbRef : null}
                    type="button"
                    className={`filmstrip-thumb-btn ${isActive ? 'active' : ''}`}
                    onClick={() => selectPhoto(index)}
                    aria-label={`Ver foto ${index + 1}: ${photo.title}`}
                    aria-current={isActive ? 'true' : 'false'}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="filmstrip-thumb-img"
                      loading="lazy"
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 4. Lightbox / Modal Pantalla Completa */}
        {isLightboxOpen && (
          <div
            className="lightbox-backdrop"
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Visor a pantalla completa de fotografía"
          >
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <div className="lightbox-header">
                <div className="lightbox-title-box">
                  <span className="lightbox-counter">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(totalPhotos).padStart(2, '0')}
                  </span>
                  <h4 className="lightbox-title">{currentPhoto.title}</h4>
                </div>

                <button
                  type="button"
                  className="lightbox-close-btn"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Cerrar pantalla completa"
                >
                  <X size={26} />
                </button>
              </div>

              <div className="lightbox-image-stage">
                <button
                  type="button"
                  className="lightbox-nav-btn prev-btn"
                  onClick={handlePrev}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={36} />
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentPhoto.src} alt={currentPhoto.title} className="lightbox-img" />

                <button
                  type="button"
                  className="lightbox-nav-btn next-btn"
                  onClick={handleNext}
                  aria-label="Foto siguiente"
                >
                  <ChevronRight size={36} />
                </button>
              </div>

              <div className="lightbox-footer">
                <p className="lightbox-caption">{currentPhoto.caption}</p>
                <span className="lightbox-hint">Usa las teclas de flecha ← y → para navegar • Presiona Esc para salir</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
