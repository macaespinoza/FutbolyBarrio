export interface TestimonialInput {
  nombre: string
  email: string
  asunto: string
  mensaje: string
}

export type FieldErrors = Partial<Record<keyof TestimonialInput, string>>

export const ASUNTOS = {
  historia: '⚽ Tengo una historia / foto de barrio en Arica',
  prensa: '📰 Prensa y Difusión Cultural',
  colaboracion: '🤝 Propuesta de Colaboración o Patrocinio',
  general: '💬 Consulta General',
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validación compartida: se usa en el cliente (UX) y en el servidor (seguridad). */
export function validateTestimonial(input: TestimonialInput): FieldErrors {
  const errors: FieldErrors = {}
  const nombre = input.nombre.trim()
  const mensaje = input.mensaje.trim()

  if (nombre.length < 2 || nombre.length > 80) {
    errors.nombre = 'Ingresa tu nombre (entre 2 y 80 caracteres).'
  }
  if (!EMAIL_RE.test(input.email.trim()) || input.email.length > 120) {
    errors.email = 'Ingresa un correo electrónico válido.'
  }
  if (!(input.asunto in ASUNTOS)) {
    errors.asunto = 'Selecciona un motivo válido.'
  }
  if (mensaje.length < 10 || mensaje.length > 3000) {
    errors.mensaje = 'Tu mensaje debe tener entre 10 y 3000 caracteres.'
  }
  return errors
}
