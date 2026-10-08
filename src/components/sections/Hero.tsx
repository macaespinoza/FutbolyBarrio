import { Play, ChevronDown } from 'lucide-react'
import Navbar from './Navbar'

export default function Hero() {
  return (
    <section className="hero-container">
      <video autoPlay loop muted playsInline className="hero-video-bg" src="/hero-video.webm" />
      <div className="hero-overlay" />

      <Navbar />

      <div className="hero-content">
        <h1 className="hero-title">
          EL FÚTBOL QUE
          <br />
          <span className="text-gradient">NO SALE EN LA TELE</span>
        </h1>
        <p className="hero-subtitle">Historias, anécdotas y recorridos por las canchas de Arica.</p>
        <div className="hero-actions">
          <a href="#documental" className="btn btn-primary hero-btn">
            <Play size={18} fill="currentColor" /> Ver Trailer Oficial
          </a>
        </div>
      </div>

      <div className="hero-footer">
        <a href="#documental" className="scroll-indicator" aria-label="Ir a sección de trailer y capítulos">
          <span>Desliza para explorar</span>
          <ChevronDown size={20} className="animate-bounce" />
        </a>
      </div>
    </section>
  )
}
