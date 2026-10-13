'use client'

import { FileText, Download, ExternalLink } from 'lucide-react'

interface PdfViewerProps {
  src: string
  title: string
  sizeLabel?: string
  downloadName?: string
}

export default function PdfViewer({ src, title, sizeLabel, downloadName }: PdfViewerProps) {
  return (
    <div className="pdf-viewer-card">
      <div className="pdf-toolbar">
        <div className="pdf-title-info">
          <FileText size={20} className="pdf-icon" aria-hidden="true" />
          <div>
            <strong>{title}</strong>
            {sizeLabel && <span className="pdf-filesize">{sizeLabel}</span>}
          </div>
        </div>
        <div className="pdf-actions">
          <a href={src} download={downloadName} className="btn btn-glass btn-sm">
            <Download size={16} aria-hidden="true" /> Descargar
          </a>
          <a href={src} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            <ExternalLink size={16} aria-hidden="true" /> Abrir completo
          </a>
        </div>
      </div>

      <div className="pdf-embed-wrapper">
        {/* loading="lazy": el PDF no se descarga hasta que el visor se acerca al viewport */}
        <iframe
          src={`${src}#toolbar=1&navpanes=0&view=FitH`}
          className="pdf-embed-object"
          title={title}
          loading="lazy"
        />
      </div>
    </div>
  )
}
