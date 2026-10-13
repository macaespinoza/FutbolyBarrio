import { Play } from 'lucide-react'
import Navbar from './Navbar'

export default function Hero() {
  return (
    <section className="hero-container">
      <video autoPlay loop muted playsInline preload="auto" className="hero-video-bg" src="/hero-video.webm" />
      <div className="hero-overlay" />

      <Navbar />

      <div className="hero-content">
        <h1 className="hero-title">
          La pasión por el fútbol
          <br />
          <span className="text-gradient">en el barrio</span>
        </h1>
        <p className="hero-subtitle">Historias, anécdotas y recorridos por las canchas de Arica.</p>
        <a href="#documental" className="btn btn-hero">
          <Play size={18} fill="currentColor" aria-hidden="true" /> Ver Teaser Trailer
        </a>
      </div>
    </section>
  )
}
