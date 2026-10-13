import PdfViewer from '@/components/ui/PdfViewer'

export default function Dossier() {
  return (
    <section id="documento" className="section">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">Revista y Documentación Cultural</h2>
          <p className="section-desc">Lee y examina el archivo documental impreso del proyecto Fútbol y Barrio.</p>
        </header>

        <PdfViewer
          src="/documento_investigacion.pdf"
          title="Documento de Investigación Fútbol y Barrio"
          sizeLabel="PDF, 42 KB"
          downloadName="Futbol_y_Barrio_Documento_Investigacion.pdf"
        />
      </div>
    </section>
  )
}
