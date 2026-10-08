'use client'

import { useActionState, useState, type FormEvent } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { sendTestimonial, type TestimonialState } from '@/actions/testimonial'
import { ASUNTOS, validateTestimonial, type FieldErrors, type TestimonialInput } from '@/lib/validation'

const initialState: TestimonialState = { status: 'idle' }

export default function Contact() {
  const [formKey, setFormKey] = useState(0)
  // Al cambiar la key se remonta el formulario y useActionState vuelve a 'idle'.
  return <ContactBody key={formKey} onReset={() => setFormKey((k) => k + 1)} />
}

function ContactBody({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(sendTestimonial, initialState)
  const [clientErrors, setClientErrors] = useState<FieldErrors>({})

  // Validación en cliente (UX). El servidor vuelve a validar siempre.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget)
    const input: TestimonialInput = {
      nombre: String(fd.get('nombre') ?? ''),
      email: String(fd.get('email') ?? ''),
      asunto: String(fd.get('asunto') ?? ''),
      mensaje: String(fd.get('mensaje') ?? ''),
    }
    const errors = validateTestimonial(input)
    setClientErrors(errors)
    if (Object.keys(errors).length > 0) e.preventDefault()
  }

  const errors: FieldErrors = { ...(state.errors ?? {}), ...clientErrors }

  return (
    <section id="contacto" className="container contact-section">
      <div className="section-header">
        <span className="section-tag">
          <Send size={14} style={{ display: 'inline', marginRight: '6px' }} /> Testimonios &amp; Contacto
        </span>
        <h2 className="section-title">Escríbenos o Suma tu Historia</h2>
        <p className="section-desc">
          ¿Tienes recuerdos, fotos de canchas en Arica o consultas sobre el proyecto? Envíanos tu mensaje.
        </p>
      </div>

      <div className="contact-card">
        {state.status === 'success' ? (
          <div className="contact-success">
            <CheckCircle2 size={56} className="success-icon" />
            <h3 className="success-title">¡Mensaje Enviado con Éxito!</h3>
            <p className="success-desc">
              Muchas gracias. Hemos recibido tu mensaje y el equipo de Fútbol y Barrio se pondrá en contacto contigo a
              la brevedad.
            </p>
            <button type="button" className="btn btn-glass" onClick={onReset}>
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form className="contact-form" action={formAction} onSubmit={handleSubmit} noValidate>
            {/* Honeypot anti-spam (oculto para personas) */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
            />

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  placeholder="Ej. Carlos Mamani"
                  className="form-input"
                  aria-invalid={!!errors.nombre}
                />
                {errors.nombre && <span className="form-error">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="nombre@ejemplo.com"
                  className="form-input"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="asunto">Motivo de Contacto / Asunto</label>
              <select id="asunto" name="asunto" defaultValue="historia" className="form-select">
                {Object.entries(ASUNTOS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.asunto && <span className="form-error">{errors.asunto}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Tu Mensaje o Historia</label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={5}
                placeholder="Cuéntanos la historia de tu población, la cancha donde jugabas o lo que quieras compartir..."
                className="form-textarea"
                aria-invalid={!!errors.mensaje}
              />
              {errors.mensaje && <span className="form-error">{errors.mensaje}</span>}
            </div>

            {state.status === 'error' && state.message && (
              <p className="form-error form-error--global" role="alert">
                {state.message}
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-submit" disabled={pending}>
              <Send size={18} /> {pending ? 'Enviando…' : 'Enviar Mensaje'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
