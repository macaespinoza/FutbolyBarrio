import { Trophy, Users, MapPin } from 'lucide-react'

export default function Stories() {
  return (
    <section id="historias" className="container">
      <div className="section-header">
        <span className="section-tag">Nuestra Esencia</span>
        <h2 className="section-title">Historias de Tierra y Gambeta</h2>
        <p className="section-desc">
          Cada potrero en Arica guarda recuerdos de momentos legendarios, partidos eternos y vecinos que jugaron como
          héroes.
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
          <h3>Comunidad &amp; Pasión</h3>
          <p>Voces de vecinos, entrenadores de barrio y jugadoras que hacen latir la cultura popular futbolera.</p>
        </div>
      </div>
    </section>
  )
}
