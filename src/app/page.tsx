import Hero from '@/components/sections/Hero'
import Trailer from '@/components/sections/Trailer'
import Chapters from '@/components/sections/Chapters'
import Dossier from '@/components/sections/Dossier'
import Gallery from '@/components/sections/Gallery'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Hero />

      <main className="main-content">
        <Trailer />
        <Chapters />
        <Dossier />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
