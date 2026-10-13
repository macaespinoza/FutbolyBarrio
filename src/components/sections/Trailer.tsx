'use client'

import { Clock, Wifi } from 'lucide-react'
import VideoPlayer from '@/components/ui/VideoPlayer'
import { TRAILER } from '@/lib/content'
import { useConnectionSpeed } from '@/lib/useConnectionSpeed'

export default function Trailer() {
  const { qualityMode, setQualityMode, detectedQuality, currentQuality, speedInfo, isAuto } = useConnectionSpeed()

  return (
    <section id="documental" className="section">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">Teaser Trailer de Fútbol y Barrio</h2>
          <p className="section-desc">Primer avance documental sobre el fútbol popular en Arica.</p>
        </header>

        <div className="trailer-card">
          <VideoPlayer
            src={TRAILER.src}
            sources={TRAILER.sources}
            poster={TRAILER.poster}
            currentQuality={currentQuality}
            detectedQuality={detectedQuality}
            qualityMode={qualityMode}
            speedDescription={speedInfo.description}
            onSelectQualityMode={setQualityMode}
          />

          <div className="video-info-bar">
            <span className="info-item">
              <Clock size={16} aria-hidden="true" /> Duración {TRAILER.duration}
            </span>
            <span className="info-item" title={speedInfo.description}>
              <Wifi size={16} aria-hidden="true" /> {currentQuality}
              {isAuto ? ` (auto, ${detectedQuality})` : ' (manual)'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
