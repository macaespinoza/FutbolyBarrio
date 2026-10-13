'use client'

import { useRef, useState, useEffect, useCallback, type ChangeEvent, type CSSProperties } from 'react'
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize,
  Minimize,
  Settings,
  Check,
  Wifi,
  Sparkles,
} from 'lucide-react'
import type { VideoQuality, QualityMode } from '@/lib/useConnectionSpeed'

export interface VideoSources {
  '1080p'?: string
  '720p'?: string
  '480p'?: string
}

interface VideoPlayerProps {
  src?: string
  sources?: VideoSources
  poster?: string
  autoPlay?: boolean
  currentQuality?: VideoQuality
  detectedQuality?: VideoQuality
  qualityMode?: QualityMode
  speedDescription?: string
  onSelectQualityMode?: (mode: QualityMode) => void
}

function formatTime(seconds: number) {
  if (Number.isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function VideoPlayer({
  src,
  sources,
  poster,
  autoPlay = false,
  currentQuality: propQuality,
  detectedQuality = '1080p',
  qualityMode = 'auto',
  speedDescription,
  onSelectQualityMode,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false)
  const [qualityNotice, setQualityNotice] = useState<string | null>(null)

  // Referencias para preservar la reproducción al cambiar de calidad
  const resumeTimeRef = useRef<number | null>(null)
  const resumePlayingRef = useRef<boolean>(false)

  // Determinar la calidad activa efectiva
  const effectiveQuality: VideoQuality = propQuality || '1080p'

  // Determinar la URL del video según la calidad activa
  const resolvedSrc =
    (sources && sources[effectiveQuality]) ||
    src ||
    sources?.['1080p'] ||
    sources?.['720p'] ||
    sources?.['480p'] ||
    ''

  // Temporizador para auto-ocultar los controles (1.8s en pantalla completa, 2.5s en ventana)
  const resetControlsTimer = useCallback((customDelay?: number) => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    // Solo auto-ocultar si el video se está reproduciendo y el menú de ajustes no está abierto
    if (isPlaying && !qualityMenuOpen) {
      const delay = customDelay ?? (isFullscreen ? 1800 : 2500)
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, delay)
    }
  }, [isPlaying, isFullscreen, qualityMenuOpen])

  // Escuchar evento nativo de fullscreen para sincronizar estado
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement)
      setIsFullscreen(isFs)
      if (isFs) {
        // En pantalla completa ocultamos de inmediato la barra inferior
        setShowControls(false)
      } else {
        setShowControls(true)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Al cambiar estado de reproducción
  useEffect(() => {
    if (isPlaying) {
      resetControlsTimer(isFullscreen ? 1200 : 2500)
    } else {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying, isFullscreen, resetControlsTimer])

  // Cerrar el menú de calidad al hacer clic afuera
  useEffect(() => {
    if (!qualityMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setQualityMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [qualityMenuOpen])

  // Desvanecer notificación de cambio de calidad
  useEffect(() => {
    if (!qualityNotice) return
    const timer = setTimeout(() => setQualityNotice(null), 2800)
    return () => clearTimeout(timer)
  }, [qualityNotice])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      void video.play()
    }
    setIsPlaying(!isPlaying)
    resetControlsTimer()
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const total = video.duration || 1
    setCurrentTime(video.currentTime)
    setProgress((video.currentTime / total) * 100)
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration)

    // Restaurar posición y estado de reproducción si acabamos de cambiar de resolución
    if (resumeTimeRef.current !== null) {
      video.currentTime = resumeTimeRef.current
      if (resumePlayingRef.current) {
        void video.play()
        setIsPlaying(true)
      }
      resumeTimeRef.current = null
    }
  }

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value)
    const video = videoRef.current
    if (video && video.duration) {
      const newTime = (newProgress / 100) * video.duration
      video.currentTime = newTime
      setProgress(newProgress)
      setCurrentTime(newTime)
    }
    resetControlsTimer(3000)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
    resetControlsTimer()
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err: unknown) => console.log(err))
      // Desaparecer la barra inferior INMEDIATAMENTE al entrar a pantalla completa
      setShowControls(false)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    } else {
      void document.exitFullscreen()
      setShowControls(true)
    }
  }

  // Cambio de calidad manteniendo posición exacta en segundos
  const handleSelectQuality = (mode: QualityMode) => {
    if (videoRef.current) {
      resumeTimeRef.current = videoRef.current.currentTime
      resumePlayingRef.current = !videoRef.current.paused
    }

    if (onSelectQualityMode) {
      onSelectQualityMode(mode)
    }

    setQualityMenuOpen(false)

    const label =
      mode === 'auto'
        ? `Calidad Automática: ${detectedQuality}`
        : mode === '1080p'
          ? 'Calidad: 1080p Full HD'
          : mode === '720p'
            ? 'Calidad: 720p Ligero'
            : 'Calidad: 480p Ahorro de datos'

    setQualityNotice(label)
    resetControlsTimer(2500)
  }

  return (
    <div
      className={`custom-video-player ${isFullscreen ? 'is-fullscreen' : ''} ${
        !showControls && isFullscreen ? 'hide-cursor' : ''
      }`}
      ref={containerRef}
      onMouseMove={() => resetControlsTimer()}
      onTouchStart={() => resetControlsTimer()}
      onMouseLeave={() => {
        if (isPlaying && !qualityMenuOpen) {
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
          controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 300)
        }
      }}
    >
      <video
        ref={videoRef}
        src={resolvedSrc}
        poster={poster}
        autoPlay={autoPlay}
        preload="metadata"
        className="custom-video-element"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onEnded={() => {
          setIsPlaying(false)
          setShowControls(true)
        }}
      />

      {/* Notificación flotante de cambio de calidad */}
      {qualityNotice && (
        <div className="video-quality-toast">
          <Sparkles size={14} />
          <span>{qualityNotice}</span>
        </div>
      )}

      {/* Botón central grande cuando está pausado */}
      {!isPlaying && (
        <button className="video-big-play-btn" onClick={togglePlay} aria-label="Reproducir video">
          <Play size={34} fill="currentColor" style={{ marginLeft: '4px' }} />
        </button>
      )}

      {/* Barra de controles inferior interactiva con auto-hide suave */}
      <div
        className={`custom-controls-bar ${!showControls ? 'controls-hidden' : ''}`}
        aria-hidden={!showControls}
      >
        <div className="progress-container">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="soccer-range"
            aria-label="Progreso del video"
            title="Progreso del partido/video (Pelota de fútbol)"
            style={
              {
                '--ball-rot': `${progress * 36}deg`,
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${progress}%, rgba(255, 255, 255, 0.25) ${progress}%, rgba(255, 255, 255, 0.25) 100%)`,
              } as CSSProperties
            }
          />
        </div>

        <div className="controls-row">
          <div className="controls-left">
            <button className="control-btn" onClick={togglePlay} title={isPlaying ? 'Pausar' : 'Reproducir'}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            </button>
            <button className="control-btn" onClick={toggleMute} title={isMuted ? 'Activar sonido' : 'Silenciar'}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="controls-right">
            {/* Selector de Calidad Adaptativo */}
            {sources && (
              <div className="quality-dropdown-wrap" ref={menuRef}>
                <button
                  type="button"
                  className={`control-btn quality-control-btn ${qualityMenuOpen ? 'active' : ''}`}
                  onClick={() => {
                    setQualityMenuOpen((prev) => !prev)
                    resetControlsTimer(5000)
                  }}
                  title="Calidad de video y conexión"
                  aria-label="Ajustes de calidad de video"
                  aria-expanded={qualityMenuOpen}
                >
                  <span className="quality-pill-text">
                    {effectiveQuality}
                  </span>
                  <Settings size={14} className="quality-gear-icon" />
                </button>

                {qualityMenuOpen && (
                  <div className="quality-menu-popover" role="dialog" aria-label="Opciones de calidad">
                    <div className="quality-menu-header">
                      <span>Calidad de Video</span>
                      {qualityMode === 'auto' && (
                        <span className="quality-tag-auto">Auto</span>
                      )}
                    </div>

                    <div className="quality-menu-list">
                      <button
                        type="button"
                        className={`quality-menu-item ${qualityMode === 'auto' ? 'active' : ''}`}
                        onClick={() => handleSelectQuality('auto')}
                      >
                        <div className="quality-item-info">
                          <span className="quality-item-name">
                            Automática <span className="quality-auto-detail">({detectedQuality})</span>
                          </span>
                          <span className="quality-item-desc">
                            Se adapta a la velocidad de tu conexión
                          </span>
                        </div>
                        {qualityMode === 'auto' && <Check size={16} className="quality-check" />}
                      </button>

                      {sources['1080p'] && (
                        <button
                          type="button"
                          className={`quality-menu-item ${qualityMode === '1080p' ? 'active' : ''}`}
                          onClick={() => handleSelectQuality('1080p')}
                        >
                          <div className="quality-item-info">
                            <span className="quality-item-name">1080p Full HD</span>
                            <span className="quality-item-desc">Máxima nitidez • ~136 MB</span>
                          </div>
                          {qualityMode === '1080p' && <Check size={16} className="quality-check" />}
                        </button>
                      )}

                      {sources['720p'] && (
                        <button
                          type="button"
                          className={`quality-menu-item ${qualityMode === '720p' ? 'active' : ''}`}
                          onClick={() => handleSelectQuality('720p')}
                        >
                          <div className="quality-item-info">
                            <span className="quality-item-name">720p Ligero</span>
                            <span className="quality-item-desc">Carga rápida • ~41 MB</span>
                          </div>
                          {qualityMode === '720p' && <Check size={16} className="quality-check" />}
                        </button>
                      )}

                      {sources['480p'] && (
                        <button
                          type="button"
                          className={`quality-menu-item ${qualityMode === '480p' ? 'active' : ''}`}
                          onClick={() => handleSelectQuality('480p')}
                        >
                          <div className="quality-item-info">
                            <span className="quality-item-name">480p Ahorro</span>
                            <span className="quality-item-desc">Carga ultra rápida para conexiones lentas • ~20.6 MB</span>
                          </div>
                          {qualityMode === '480p' && <Check size={16} className="quality-check" />}
                        </button>
                      )}
                    </div>

                    {speedDescription && (
                      <div className="quality-menu-footer">
                        <Wifi size={13} className="speed-icon" />
                        <span className="speed-text">{speedDescription}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              className="control-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
