import { CHAPTERS } from '@/lib/content'

export default function Chapters() {
  return (
    <section id="capitulos" className="section">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">Capítulos de la Serie</h2>
          <p className="section-desc">
            Cinco microdocumentales sobre la Asociación de Fútbol Morro de Arica. Todos están en producción.
          </p>
        </header>

        <ol className="chapter-list">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id} className="chapter-item">
              <span className="chapter-number" aria-hidden="true">
                {chapter.number}
              </span>
              <div className="chapter-body">
                <div className="chapter-header-row">
                  <h3 className="chapter-title">{chapter.title}</h3>
                  <span className="chapter-tag">Próximamente</span>
                </div>
                <p className="chapter-desc">{chapter.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
