import { useState, useRef } from 'react'
import { 
  Volume2, VolumeX, Play, Pause, Maximize, Minimize, ChevronDown, Trophy, Users, MapPin, 
  Sparkles, Film, FileText, Download, ExternalLink, X, BookOpen, Clock, Eye, Send, CheckCircle2 
} from 'lucide-react'
import './App.css'

function VideoPlayer({ src, poster, autoPlay = false }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const total = videoRef.current.duration || 1
      setCurrentTime(current)
      setProgress((current / total) * 100)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const newProgress = parseFloat(e.target.value)
    if (videoRef.current && videoRef.current.duration) {
      const newTime = (newProgress / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
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
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => console.log(err))
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="custom-video-player" ref={containerRef}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className="custom-video-element"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Overlay Big Play Button when paused */}
      {!isPlaying && (
        <button className="video-big-play-btn" onClick={togglePlay} aria-label="Reproducir Video">
          <Play size={34} fill="currentColor" style={{ marginLeft: '4px' }} />
        </button>
      )}

      {/* Custom Controls Bar */}
      <div className="custom-controls-bar">
        {/* Soccer Ball Progress Bar */}
        <div className="progress-container">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="soccer-range"
            title="Progreso del partido/video (Pelota de fútbol)"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${progress}%, rgba(255, 255, 255, 0.25) ${progress}%, rgba(255, 255, 255, 0.25) 100%)`
            }}
          />
        </div>

        <div className="controls-row">
          <div className="controls-left">
            <button className="control-btn" onClick={togglePlay} title={isPlaying ? "Pausar" : "Reproducir"}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            </button>
            <button className="control-btn" onClick={toggleMute} title={isMuted ? "Activar sonido" : "Silenciar"}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="controls-right">
            <button className="control-btn" onClick={toggleFullscreen} title="Pantalla Completa">
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isMuted, setIsMuted] = useState(true)
  const [activeChapter, setActiveChapter] = useState(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: 'historia',
    mensaje: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (formData.nombre && formData.email && formData.mensaje) {
      setFormSubmitted(true)
    }
  }

  const chapters = [
    {
      id: 1,
      number: "01",
      title: "Tierra y Gambeta: El Origen",
      duration: "14:20 min",
      tag: "Historia & Raíces",
      desc: "Un recorrido por las primeras canchas de tierra de Arica y los momentos emblemáticos que dieron origen al fútbol barrial.",
      videoSrc: "/hero-video.webm"
    },
    {
      id: 2,
      number: "02",
      title: "Los Héroes de la Cuadra",
      duration: "18:45 min",
      tag: "Personajes",
      desc: "Entrevistas exclusivas con las leyendas locales, los goleadores domingueros y los vecinos que mantienen viva la pasión.",
      videoSrc: "/hero-video.webm"
    },
    {
      id: 3,
      number: "03",
      title: "Las Canchas de Arica",
      duration: "16:10 min",
      tag: "Territorio",
      desc: "El mapa sonoro y visual de los potreros e instalaciones icónicas donde cada fin de semana late la cultura popular.",
      videoSrc: "/hero-video.webm"
    },
    {
      id: 4,
      number: "04",
      title: "Pasión, Música y Comunidad",
      duration: "21:05 min",
      tag: "Cultura Barrial",
      desc: "Las bandas de bronce, las familias en las graderías de tierra y el impacto social que une a los barrios de nuestra ciudad.",
      videoSrc: "/hero-video.webm"
    }
  ]

  return (
    <div className="app">
      {/* HERO SECTION FULLSCREEN */}
      <section className="hero-container">
        {/* Fullscreen WebM Video Background */}
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="hero-video-bg"
          src="/hero-video.webm"
        />

        {/* Ambient Dark Overlay */}
        <div className="hero-overlay" />

        {/* Floating Navbar */}
        <header className="navbar">
          <a href="#" className="nav-brand" title="Fútbol y Barrio">
            <img src="/logov1.svg" alt="Fútbol y Barrio" className="nav-logo" />
          </a>
          <ul className="nav-links">
            <li><a href="#historias">Historias</a></li>
            <li><a href="#documental">Trailer</a></li>
            <li><a href="#capitulos">Capítulos</a></li>
            <li><a href="#documento">Documento</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
          <a href="#documental" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            <Play size={15} fill="currentColor" /> Ver Trailer
          </a>
        </header>

        {/* Hero Central Content */}
        <div className="hero-content">
          <div className="badge">
            <Sparkles size={16} /> Proyecto Cultural & Documental
          </div>
          <h1 className="hero-title">
            EL FÚTBOL QUE<br />
            <span className="text-gradient">NO SALE EN LA TELE</span>
          </h1>
          <p className="hero-subtitle">
            Historias, anécdotas y recorridos por las canchas de Arica.
          </p>
          <div className="hero-actions">
            <a href="#documental" className="btn btn-primary">
              <Play size={18} fill="currentColor" /> Ver Trailer Oficial
            </a>
            <button
              type="button"
              className="btn btn-glass"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Activar sonido" : "Silenciar sonido"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span>{isMuted ? "Activar Sonido" : "Sonido Activado"}</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-footer">
          <a href="#historias" className="scroll-indicator">
            <span>Desliza para explorar</span>
            <ChevronDown size={20} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* MAIN CONTENT SECTIONS */}
      <main className="main-content">
        
        {/* SECCIÓN HISTORIAS */}
        <section id="historias" className="container">
          <div className="section-header">
            <span className="section-tag">Nuestra Esencia</span>
            <h2 className="section-title">Historias de Tierra y Gambeta</h2>
            <p className="section-desc">
              Cada potrero en Arica guarda recuerdos de momentos legendarios, partidos eternos y vecinos que jugaron como héroes.
            </p>
          </div>

          <div className="stories-grid">
            <div className="story-card">
              <div className="story-icon">
                <Trophy size={26} />
              </div>
              <h3>El Torneo del Barrio</h3>
              <p>
                Donde los domingos se paraliza la cuadra y el trofeo es el orgullo de ser campeón en tu propia tierra.
              </p>
            </div>

            <div className="story-card">
              <div className="story-icon">
                <MapPin size={26} />
              </div>
              <h3>Canchas de Arica</h3>
              <p>
                Relatos y recuerdos de los potreros icónicos donde se forjaron los talentos de nuestra cultura local.
              </p>
            </div>

            <div className="story-card">
              <div className="story-icon">
                <Users size={26} />
              </div>
              <h3>Comunidad & Pasión</h3>
              <p>
                Voces de vecinos, entrenadores de barrio y jugadoras que hacen latir la cultura popular futbolera.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN TRAILER */}
        <section id="documental" className="container trailer-section">
          <div className="section-header">
            <span className="section-tag"><Film size={14} style={{ display: 'inline', marginRight: '6px' }} /> Avance Exclusivo</span>
            <h2 className="section-title">Trailer Oficial del Documental</h2>
            <p className="section-desc">
              Una mirada cinematográfica a las canchas de Arica, sus anécdotas e historias inolvidables.
            </p>
          </div>

          <div className="video-player-wrapper">
            <VideoPlayer src="/hero-video.webm" poster="/hero.png" />
            <div className="video-info-bar">
              <div className="info-item">
                <Film size={18} className="info-icon" />
                <span>Trailer Oficial — Fútbol y Barrio</span>
              </div>
              <div className="info-item">
                <Clock size={18} className="info-icon" />
                <span>Duración: 02:45 min</span>
              </div>
              <div className="info-item">
                <span className="badge-quality">HD 1080p</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN CAPÍTULOS */}
        <section id="capitulos" className="container chapters-section">
          <div className="section-header">
            <span className="section-tag">Serie Documental</span>
            <h2 className="section-title">Capítulos de la Serie</h2>
            <p className="section-desc">
              Explora cada episodio de nuestra investigación sobre la cultura y las vivencias del fútbol barrial en Arica.
            </p>
          </div>

          <div className="chapters-grid">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="chapter-card">
                <div className="chapter-thumb-wrapper" onClick={() => setActiveChapter(chapter)}>
                  <video src={chapter.videoSrc} className="chapter-thumb-video" muted preload="metadata" />
                  <div className="chapter-thumb-overlay">
                    <button className="play-chapter-btn" aria-label={`Reproducir ${chapter.title}`}>
                      <Play size={24} fill="currentColor" style={{ marginLeft: '3px' }} />
                    </button>
                  </div>
                  <span className="chapter-number-badge">Capítulo {chapter.number}</span>
                  <span className="chapter-duration-badge"><Clock size={13} /> {chapter.duration}</span>
                </div>
                <div className="chapter-content">
                  <span className="chapter-tag">{chapter.tag}</span>
                  <h3 className="chapter-title">{chapter.title}</h3>
                  <p className="chapter-desc">{chapter.desc}</p>
                  <button 
                    type="button" 
                    className="btn btn-glass btn-sm"
                    onClick={() => setActiveChapter(chapter)}
                  >
                    <Play size={16} fill="currentColor" /> Reproducir Capítulo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN VISUALIZADOR DE PDF / DOCUMENTO */}
        <section id="documento" className="container pdf-section">
          <div className="section-header">
            <span className="section-tag"><BookOpen size={14} style={{ display: 'inline', marginRight: '6px' }} /> Publicación Oficial</span>
            <h2 className="section-title">Revista & Documentación Cultural</h2>
            <p className="section-desc">
              Lee y examina el archivo documental impreso del proyecto Fútbol y Barrio (`doc.pdf`).
            </p>
          </div>

          <div className="pdf-viewer-card">
            <div className="pdf-toolbar">
              <div className="pdf-title-info">
                <FileText size={20} className="pdf-icon" />
                <div>
                  <strong>Documento Cultural Fútbol y Barrio</strong>
                  <span className="pdf-filesize"> (Formato PDF — 570 KB)</span>
                </div>
              </div>
              <div className="pdf-actions">
                <a 
                  href="/doc.pdf" 
                  download="Futbol_y_Barrio_Documento.pdf"
                  className="btn btn-glass btn-sm" 
                  title="Descargar PDF completo"
                >
                  <Download size={16} /> Descargar PDF
                </a>
                <a 
                  href="/doc.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  title="Abrir PDF en pantalla completa"
                >
                  <ExternalLink size={16} /> Abrir Completo
                </a>
              </div>
            </div>

            <div className="pdf-embed-wrapper">
              <object
                data="/doc.pdf"
                type="application/pdf"
                className="pdf-embed-object"
              >
                <div className="pdf-fallback">
                  <FileText size={48} />
                  <p>Tu navegador no admite la previsualización directa de archivos PDF.</p>
                  <a href="/doc.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <Eye size={18} /> Ver Documento PDF
                  </a>
                </div>
              </object>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE ESTADÍSTICAS */}
        <section className="stats-banner">
          <div className="stats-container">
            <div>
              <div className="stat-number">100+</div>
              <div className="stat-label">Potreros Documentados</div>
            </div>
            <div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Relatos Audiovisuales</div>
            </div>
            <div>
              <div className="stat-number">100%</div>
              <div className="stat-label">Pasión Auténtica</div>
            </div>
          </div>
        </section>

        {/* SECCIÓN CONTACTO */}
        <section id="contacto" className="container contact-section">
          <div className="section-header">
            <span className="section-tag"><Send size={14} style={{ display: 'inline', marginRight: '6px' }} /> Colaboración & Contacto</span>
            <h2 className="section-title">Escríbenos o Suma tu Historia</h2>
            <p className="section-desc">
              ¿Tienes recuerdos, fotos de canchas en Arica o consultas sobre el proyecto? Envíanos tu mensaje.
            </p>
          </div>

          <div className="contact-card">
            {formSubmitted ? (
              <div className="contact-success">
                <CheckCircle2 size={56} className="success-icon" />
                <h3 className="success-title">¡Mensaje Enviado con Éxito!</h3>
                <p className="success-desc">
                  Muchas gracias <strong>{formData.nombre}</strong>. Hemos recibido tu mensaje y el equipo de Fútbol y Barrio se pondrá en contacto contigo a la brevedad en <span>{formData.email}</span>.
                </p>
                <button 
                  type="button" 
                  className="btn btn-glass" 
                  onClick={() => {
                    setFormSubmitted(false)
                    setFormData({ nombre: '', email: '', asunto: 'historia', mensaje: '' })
                  }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo</label>
                    <input
                      type="text"
                      id="nombre"
                      required
                      placeholder="Ej. Carlos Mamani"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="nombre@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="asunto">Motivo de Contacto / Asunto</label>
                  <select
                    id="asunto"
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                    className="form-select"
                  >
                    <option value="historia">⚽ Tengo una historia / foto de barrio en Arica</option>
                    <option value="prensa">📰 Prensa y Difusión Cultural</option>
                    <option value="colaboracion">🤝 Propuesta de Colaboración o Patrocinio</option>
                    <option value="general">💬 Consulta General</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Tu Mensaje o Historia</label>
                  <textarea
                    id="mensaje"
                    required
                    rows="5"
                    placeholder="Cuéntanos la historia de tu población, la cancha donde jugabas o lo que quieras compartir..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-submit">
                  <Send size={18} /> Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* MODAL DE REPRODUCCIÓN DE CAPÍTULO */}
      {activeChapter && (
        <div className="modal-backdrop" onClick={() => setActiveChapter(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setActiveChapter(null)}
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
            <div className="modal-header">
              <span className="chapter-tag">Capítulo {activeChapter.number}</span>
              <h3 className="modal-title">{activeChapter.title}</h3>
            </div>
            <div className="modal-video-wrapper">
              <VideoPlayer src={activeChapter.videoSrc} autoPlay={true} />
            </div>
            <p className="modal-desc">{activeChapter.desc}</p>
          </div>
        </div>
      )}

      <footer>
        <img src="/logov1.svg" alt="Fútbol y Barrio Logo" className="footer-logo" />
        <p>© 2026 Fútbol Barrial — Todos los derechos reservados. Donde nace la verdadera pasión.</p>
      </footer>
    </div>
  )
}

export default App

