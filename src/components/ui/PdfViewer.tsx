'use client'

import { useState } from 'react'
import { FileText, Download, ExternalLink, Eye } from 'lucide-react'

interface PdfViewerProps {
  src: string
  title: string
  sizeLabel?: string
  downloadName?: string
}

/**
 * Visor ligero: no carga el PDF hasta que el usuario lo pide,
 * así no ralentiza la carga inicial de la página.
 */
export default function PdfViewer({ src, title, sizeLabel, downloadName }: PdfViewerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="pdf-viewer-card">
      <div className="pdf-toolbar">
        <div className="pdf-title-info">
          <FileText size={20} className="pdf-icon" />
          <div>
            <strong>{title}</strong>
            {sizeLabel && <span className="pdf-filesize"> ({sizeLabel})</span>}
          </div>
        </div>
        <div className="pdf-actions">
          <a href={src} download={downloadName} className="btn btn-glass btn-sm" title="Descargar PDF completo">
            <Download size={16} /> Descargar PDF
          </a>
          <a
            href={src}
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
        {open ? (
          <object data={src} type="application/pdf" className="pdf-embed-object">
            <div className="pdf-fallback">
              <FileText size={48} />
              <p>Tu navegador no admite la previsualización directa de archivos PDF.</p>
              <a href={src} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Eye size={18} /> Ver Documento PDF
              </a>
            </div>
          </object>
        ) : (
          <div className="pdf-fallback">
            <FileText size={48} />
            <p>El documento se carga solo cuando quieras leerlo.</p>
            <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
              <Eye size={18} /> Leer documento
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
