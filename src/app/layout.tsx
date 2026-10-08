import type { Metadata, Viewport } from 'next'
import './globals.css'
import './app.css'

export const metadata: Metadata = {
  title: 'Fútbol Barrial — Donde el Gol se Grita con el Alma',
  description:
    'Fútbol Barrial — Un proyecto cultural que celebra la pasión, el humor y la nostalgia del fútbol de barrio sudamericano. Historias de tierra, goles y comunidad.',
  icons: { icon: '/logov1.svg' },
  openGraph: {
    title: 'Fútbol Barrial — Donde el Gol se Grita con el Alma',
    description:
      'Un recorrido cinematográfico por las canchas de tierra, las anécdotas de barrio y la pasión que une comunidades.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#081a0e',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Staatliches&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
