'use client'

import { useState, useEffect } from 'react'
import { Film, Clock, Sparkles } from 'lucide-react'
import VideoPlayer from '@/components/ui/VideoPlayer'
import { TEASERS, CHAPTERS } from '@/lib/content'

export default function Trailer() {
  const [activeTeaserId, setActiveTeaserId] = useState<string>(TEASERS[0]?.id ?? '')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const activeTeaser = TEASERS.find((t) => t.id === activeTeaserId) ?? TEASERS[0]

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3600)
    return () => clearTimeout(timer)
  }, [toastMessage])

  if (!activeTeaser) return null

  return (
    <section id="documental" className="trailer-chapters-section">
      {/* 1. Header de Sección */}
      <div className="container" style={{ paddingBottom: '24px' }}>
        <div className="section-header">
          <span className="section-tag">
            <Film size={14} style={{ display: 'inline', marginRight: '6px' }} /> Serie Documental
          </span>
          <h2 className="section-title">Trailer Oficial &amp; Capítulos</h2>
          <p className="section-desc">
            Disfruta el avance oficial cinematográfico y conoce los episodios programados para la siguiente etapa de
            producción.
          </p>
        </div>
      </div>

      {/* 2. Reproductor de Trailer en Pantalla Casi Completa */}
      <div className="cinema-trailer-viewport">
        <div className="cinema-trailer-card">
          <div className="teaser-selector" role="tablist" aria-label="Seleccionar teaser">
            {TEASERS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === activeTeaser.id}
                className={`teaser-tab ${t.id === activeTeaser.id ? 'active' : ''}`}
                onClick={() => setActiveTeaserId(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="cinema-player-box">
            <VideoPlayer key={activeTeaser.id} src={activeTeaser.src} poster={activeTeaser.poster} />
          </div>

          <div className="video-info-bar">
            <div className="info-item">
              <Film size={18} className="info-icon" />
              <span>{activeTeaser.label} — Fútbol y Barrio (Arica)</span>
            </div>
            <div className="info-item">
              <Clock size={18} className="info-icon" />
              <span>Duración: {activeTeaser.duration}</span>
            </div>
            <div className="badge-quality">HD 1080p • Cine Barrial</div>
          </div>
        </div>
      </div>

      {/* 3. Sección de Capítulos de la Serie */}
      <div id="capitulos" className="container playlist-container">
        <div className="playlist-header">
          <div className="playlist-title-wrap">
            <span className="playlist-kicker">
              <Sparkles size={14} style={{ display: 'inline', marginRight: '5px' }} /> Serie Documental
            </span>
            <h3 className="playlist-heading">Capítulos de la Serie</h3>
            <p className="playlist-sub">
              5 microdocumentales temáticos sobre la Asociación de Fútbol Morro de Arica, explorando su tradición, comunidad y pasión.
            </p>
          </div>
        </div>

        <div className="simple-chapters-grid">
          {CHAPTERS.map((chapter) => (
            <article key={chapter.id} className="simple-chapter-card">
              <div className="chapter-simple-badge-row">
                <span className="chapter-number-pill">Capítulo {chapter.number}</span>
                <span className="chapter-tag-production">
                  <span className="production-pulse" aria-hidden="true" />
                  En producción
                </span>
              </div>

              <h4 className="chapter-simple-title">{chapter.title}</h4>

              <p className="chapter-simple-desc">{chapter.desc}</p>

              <div className="chapter-simple-footer">
                <button
                  type="button"
                  className="btn-proximamente"
                  onClick={() =>
                    setToastMessage(`El capítulo "${chapter.title}" está en producción y estará disponible próximamente.`)
                  }
                  aria-label={`Capítulo ${chapter.number}: ${chapter.title} — Próximamente`}
                >
                  <Clock size={15} /> Próximamente
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 4. Notificación Toast Flotante */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <Sparkles size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  )
}
