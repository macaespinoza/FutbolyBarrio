# Fútbol y Barrio

Landing page documental e interactiva sobre la memoria, el humor y la mística del fútbol de barrio en Arica.

## Stack
- Next.js (App Router) + React 19
- TypeScript en modo estricto
- Server Actions + Nodemailer (envío de testimonios)
- CSS propio, iconos con `lucide-react`

## Scripts
```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck  # tsc --noEmit
npm run lint       # oxlint
```

## Variables de entorno
Copia `.env.example` a `.env.local` y completa:

| Variable | Descripción |
|---|---|
| `GMAIL_USER` | Cuenta Gmail que envía los correos |
| `GMAIL_APP_PASSWORD` | Contraseña de aplicación de esa cuenta (no la clave normal) |
| `TESTIMONIOS_TO` | Destino (por defecto `rivasvaras.multimedia@gmail.com`) |

## Estructura
```
src/
  app/                 layout, page y estilos globales
  actions/             Server Actions (testimonial.ts)
  components/
    sections/          Hero, Stories, Trailer, Chapters, Dossier, Stats, Contact, Footer, Navbar
    ui/                GrassButton, VideoPlayer, PdfViewer
  lib/                 content.ts (datos) y validation.ts (validación compartida cliente/servidor)
public/                videos, PDF, fuentes, logos e imágenes
```

## Pendiente
- Segundo teaser real (hoy ambos teasers apuntan a `hero-video.webm`) y videos reales por capítulo.
- Adaptar la paleta a la definida en `AGENTS.md`.
- Poster del trailer (`public/hero.png`).
