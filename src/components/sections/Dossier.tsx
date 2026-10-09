import { BookOpen } from 'lucide-react'
import PdfViewer from '@/components/ui/PdfViewer'

export default function Dossier() {
  return (
    <section id="documento" className="container pdf-section">
      <div className="section-header">
        <span className="section-tag">
          <BookOpen size={14} style={{ display: 'inline', marginRight: '6px' }} /> Publicación Oficial
        </span>
        <h2 className="section-title">Revista &amp; Documentación Cultural</h2>
        <p className="section-desc">Lee y examina el archivo documental impreso del proyecto Fútbol y Barrio.</p>
      </div>

      <PdfViewer
        src="/documento_investigacion.pdf"
        title="Documento de Investigación Fútbol y Barrio"
        sizeLabel="Formato PDF — 42 KB"
        downloadName="Futbol_y_Barrio_Documento_Investigacion.pdf"
      />
    </section>
  )
}
