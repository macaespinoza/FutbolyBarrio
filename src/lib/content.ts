export const NAV_ITEMS = [
  { href: '#documental', label: 'Trailer & Capítulos' },
  { href: '#documento', label: 'Dossier PDF' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Testimonios' },
] as const

export interface Teaser {
  id: string
  label: string
  src: string
  poster?: string
  duration: string
}

export const TEASERS: readonly Teaser[] = [
  { id: 'teaser-1', label: 'Teaser 1: El Potrero', src: '/trailer.mp4', duration: '02:14 min' },
  { id: 'teaser-2', label: 'Teaser 2: La Hinchada', src: '/hero-video.webm', duration: '02:45 min' },
]

export interface Chapter {
  id: number
  number: string
  title: string
  tag: string
  desc: string
  status: 'production' | 'upcoming'
}

export const CHAPTERS: readonly Chapter[] = [
  {
    id: 1,
    number: '01',
    title: 'Familia y fútbol: el núcleo que sostiene a los clubes',
    tag: 'En producción',
    desc: 'Generaciones enteras en las gradas: el rol vital de las familias que cosen camisetas, alientan cada fin de semana y mantienen viva la identidad de cada equipo.',
    status: 'production',
  },
  {
    id: 2,
    number: '02',
    title: 'La Cancha del Morro: el templo de la tradición barrial',
    tag: 'En producción',
    desc: 'Tierra, viento y memoria viva. Historias y testimonios de un espacio emblemático de Arica que ha visto nacer leyendas y tardes imborrables.',
    status: 'production',
  },
  {
    id: 3,
    number: '03',
    title: 'La hinchada: pasión y lealtad por la población',
    tag: 'En producción',
    desc: 'Acá se alienta al vecino y al amigo de la infancia. La mística de una fiesta comunitaria donde ganar es secundario frente al orgullo de pertenecer.',
    status: 'production',
  },
  {
    id: 4,
    number: '04',
    title: 'Asociación El Morro: la orgánica del torneo amateur',
    tag: 'En producción',
    desc: 'Dirigentes vecinales, autogestión y compromiso cívico detrás de uno de los campeonatos barriales más antiguos y convocantes de la ciudad.',
    status: 'production',
  },
  {
    id: 5,
    number: '05',
    title: 'Los jugadores: pasión pura por la camiseta',
    tag: 'En producción',
    desc: 'Acá no hay contratos ni sueldos: se paga por jugar. La previa, el sudor y el orgullo de defender los colores del barrio durante los noventa minutos.',
    status: 'production',
  },
]

export const FUTURE_CHAPTERS = CHAPTERS
export type FutureChapter = Chapter

export interface GalleryPhoto {
  id: number
  src: string
  title: string
  caption: string
  tag: string
}

export const GALLERY_PHOTOS: readonly GalleryPhoto[] = [
  {
    id: 1,
    src: '/galeria/futbolybarrio.webp',
    title: 'Noche de Potrero',
    caption: 'Partido nocturno bajo las luminarias en las canchas de Arica.',
    tag: 'Canchas & Noche',
  },
  {
    id: 2,
    src: '/galeria/futbolybarrio-2.webp',
    title: 'La Mirada del Jugador',
    caption: 'Concentración y devoción antes de ingresar a disputar cada pelota.',
    tag: 'Personajes',
  },
  {
    id: 3,
    src: '/galeria/futbolybarrio-3.webp',
    title: 'El Silbato y el Terreno',
    caption: 'El arbitraje popular que impone respeto en el juego barrial.',
    tag: 'Cultura',
  },
  {
    id: 4,
    src: '/galeria/futbolybarrio-4.webp',
    title: 'La Cuadra Atenta',
    caption: 'Los vecinos observando cada jugada desde el costado de la cancha.',
    tag: 'Comunidad',
  },
  {
    id: 5,
    src: '/galeria/futbolybarrio-5.webp',
    title: 'Estrategia y Arenga',
    caption: 'Instrucciones técnicas con el corazón en la mano durante el descanso.',
    tag: 'Vestuario & Charla',
  },
  {
    id: 6,
    src: '/galeria/futbolybarrio-6.webp',
    title: 'Foco en la Jugada',
    caption: 'Intensidad pura donde no se da ninguna pelota por perdida.',
    tag: 'El Juego',
  },
  {
    id: 7,
    src: '/galeria/futbolybarrio-7.webp',
    title: 'Grito de Gol',
    caption: 'La explosión de alegría compartida por todo el barrio.',
    tag: 'Celebración',
  },
  {
    id: 8,
    src: '/galeria/futbolybarrio-8.webp',
    title: 'Graderías Improvisadas',
    caption: 'Generaciones reunidas en las tribunas de tierra y tablón.',
    tag: 'Hinchada',
  },
  {
    id: 9,
    src: '/galeria/futbolybarrio-9.webp',
    title: 'Disputa del Balón',
    caption: 'Fuerza, coraje y lealtad por defender los colores vecinales.',
    tag: 'El Juego',
  },
  {
    id: 10,
    src: '/galeria/futbolybarrio-10.webp',
    title: 'Entretiempo Barrial',
    caption: 'El agua fresca, la naranja partida y las anécdotas de potrero.',
    tag: 'Mística',
  },
  {
    id: 11,
    src: '/galeria/futbolybarrio-11.webp',
    title: 'Guardavallas de Barrio',
    caption: 'Bajo los tres palos custodiando el orgullo de la población.',
    tag: 'Personajes',
  },
  {
    id: 12,
    src: '/galeria/futbolybarrio-12.webp',
    title: 'Viento del Norte',
    caption: 'El polvo del norte chileno envolviendo el escenario del fútbol dominguero.',
    tag: 'Territorio',
  },
  {
    id: 13,
    src: '/galeria/futbolybarrio-13.webp',
    title: 'La Barra Fiel',
    caption: 'El aliento constante de las familias que no fallan ningún fin de semana.',
    tag: 'Comunidad',
  },
  {
    id: 14,
    src: '/galeria/futbolybarrio-14.webp',
    title: 'Gambeta y Toque',
    caption: 'El talento puro y la picardía aprendida en la calle.',
    tag: 'Talento',
  },
  {
    id: 15,
    src: '/galeria/futbolybarrio-15.webp',
    title: 'El Alma del Domingo',
    caption: 'Un ritual que une a vecinos, amigos y familias completas.',
    tag: 'Tradición',
  },
  {
    id: 16,
    src: '/galeria/futbolybarrio-16.webp',
    title: 'Retrato de Potrero',
    caption: 'La dignidad y la mirada honesta del deportista de barrio.',
    tag: 'Retratos',
  },
  {
    id: 17,
    src: '/galeria/futbolybarrio-17.webp',
    title: 'Luz y Sombra',
    caption: 'Atmósfera cinematográfica al caer la tarde sobre las canchas.',
    tag: 'Fotografía',
  },
  {
    id: 18,
    src: '/galeria/futbolybarrio-18.webp',
    title: 'Camaradería Pura',
    caption: 'Rivalidad adentro, hermandad y respeto al terminar el partido.',
    tag: 'Hermandad',
  },
  {
    id: 19,
    src: '/galeria/futbolybarrio-19.webp',
    title: 'Tensión en la Banda',
    caption: 'Los últimos minutos jugados con los dientes apretados.',
    tag: 'Emoción',
  },
  {
    id: 20,
    src: '/galeria/futbolybarrio-20.webp',
    title: 'Orgullo de Población',
    caption: 'El emblema y la camiseta defendida con honor.',
    tag: 'Identidad',
  },
  {
    id: 21,
    src: '/galeria/futbolybarrio-21.webp',
    title: 'Puntapié Inicial',
    caption: 'El balón al centro: el comienzo de otra jornada inolvidable.',
    tag: 'El Juego',
  },
  {
    id: 22,
    src: '/galeria/futbolybarrio-22.webp',
    title: 'Memoria Cultural',
    caption: 'Registrando la historia viva del fútbol popular de Arica.',
    tag: 'Documental',
  },
]
