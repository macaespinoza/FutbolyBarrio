'use server'

import nodemailer from 'nodemailer'
import {
  ASUNTOS,
  validateTestimonial,
  type FieldErrors,
  type TestimonialInput,
} from '@/lib/validation'

export interface TestimonialState {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: FieldErrors
}

const DEFAULT_TO = 'rivasvaras.multimedia@gmail.com'

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

export async function sendTestimonial(
  _prev: TestimonialState,
  formData: FormData,
): Promise<TestimonialState> {
  const input: TestimonialInput = {
    nombre: String(formData.get('nombre') ?? ''),
    email: String(formData.get('email') ?? ''),
    asunto: String(formData.get('asunto') ?? ''),
    mensaje: String(formData.get('mensaje') ?? ''),
  }

  // Honeypot anti-spam: los bots rellenan este campo oculto.
  if (String(formData.get('website') ?? '') !== '') {
    return { status: 'success' }
  }

  const errors = validateTestimonial(input)
  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, message: 'Revisa los campos marcados.' }
  }

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    console.error('[testimonios] Faltan GMAIL_USER / GMAIL_APP_PASSWORD en .env.local')
    return { status: 'error', message: 'El envío no está configurado todavía. Inténtalo más tarde.' }
  }

  const asuntoLabel = ASUNTOS[input.asunto as keyof typeof ASUNTOS]

  try {
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
    await transporter.sendMail({
      from: `"Fútbol y Barrio (web)" <${user}>`,
      to: process.env.TESTIMONIOS_TO || DEFAULT_TO,
      replyTo: `"${input.nombre.trim().replace(/"/g, '')}" <${input.email.trim()}>`,
      subject: `[Fútbol y Barrio] ${asuntoLabel} — ${input.nombre.trim()}`,
      text: `Nombre: ${input.nombre}\nCorreo: ${input.email}\nMotivo: ${asuntoLabel}\n\n${input.mensaje}`,
      html: `<h2>Nuevo testimonio / mensaje</h2>
<p><b>Nombre:</b> ${escapeHtml(input.nombre)}<br/>
<b>Correo:</b> ${escapeHtml(input.email)}<br/>
<b>Motivo:</b> ${escapeHtml(asuntoLabel)}</p>
<p style="white-space:pre-wrap">${escapeHtml(input.mensaje)}</p>`,
    })
    return { status: 'success' }
  } catch (err) {
    console.error('[testimonios] Error enviando correo:', err)
    return { status: 'error', message: 'No pudimos enviar tu mensaje. Inténtalo nuevamente.' }
  }
}
