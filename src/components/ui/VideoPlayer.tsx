'use client'

import { useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import { Volume2, VolumeX, Play, Pause, Maximize, Minimize } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
}

function formatTime(seconds: number) {
  if (Number.isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function VideoPlayer({ src, poster, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      void video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const total = video.duration || 1
    setCurrentTime(video.currentTime)
    setProgress((video.currentTime / total) * 100)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration)
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
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err: unknown) => console.log(err))
      setIsFullscreen(true)
    } else {
      void document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="custom-video-player" ref={containerRef}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        preload="metadata"
        className="custom-video-element"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
      />

      {!isPlaying && (
        <button className="video-big-play-btn" onClick={togglePlay} aria-label="Reproducir video">
          <Play size={34} fill="currentColor" style={{ marginLeft: '4px' }} />
        </button>
      )}

      <div className="custom-controls-bar">
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
                '--ball-rot': `${progress * 36}deg`, // 10 vueltas a lo largo del video
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
            <button className="control-btn" onClick={toggleFullscreen} title="Pantalla completa">
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
