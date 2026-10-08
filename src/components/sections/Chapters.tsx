'use client'

import { useState, useEffect } from 'react'
import { Clock, Film, Sparkles } from 'lucide-react'
import { CHAPTERS } from '@/lib/content'

export default function Chapters() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3200)
    return () => clearTimeout(timer)
  }, [toastMessage])

  return (
    <section id="capitulos" className="container chapters-section">
      <div className="section-header">
        <span className="section-tag">
          <Film size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Serie Documental
        </span>
        <h2 className="section-title">Capítulos de la Serie</h2>
        <p className="section-desc">
          5 microdocumentales temáticos sobre la Asociación de Fútbol Morro de Arica, explorando su tradición, comunidad y pasión.
        </p>
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

            <h3 className="chapter-simple-title">{chapter.title}</h3>
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

      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <Sparkles size={16} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  )
}
