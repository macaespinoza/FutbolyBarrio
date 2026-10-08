import Hero from '@/components/sections/Hero'
import Trailer from '@/components/sections/Trailer'
import Dossier from '@/components/sections/Dossier'
import Gallery from '@/components/sections/Gallery'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <div className="app">
      {/* 1. Hero Section */}
      <Hero />

      <main className="main-content">
        {/* 2. Trailer & Capítulos (Trailer en pantalla casi completa + playlist 5 capítulos futuros) */}
        <Trailer />

        {/* 3. PDF (Dossier & Documento Cultural) */}
        <Dossier />

        {/* 4. Galería de Fotos (Carrusel Interactivo con las 22 fotos de /galeria) */}
        <Gallery />

        {/* 5. Testimonios & Contacto Comunitario */}
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
