# AGENTS.md - Proyecto Cultural: Fútbol Barrial

## Contexto del Proyecto
Landing page documental e interactiva inspirada en la estructura narrativa de "People Not Property".
El proyecto rescata la memoria, el humor y la mística del fútbol de barrio, equilibrando un tono de comedia costumbrista con pasajes emotivos y nostálgicos.

## Roles y Responsabilidades

### 1. Lead Architect & UI Designer
- Implementar la arquitectura en Next.js (App Router).
- Mantener la paleta cromática definida:
  - Verde Oscuro: `#3C401E`
  - Arena Cálido: `#F2B885`
  - Óxido / Gradas: `#592918`
  - Base Oscura: `#2A2529`
- Garantizar diseño interactivo, responsive y tipografía con carácter (mezcla entre titulares contundentes y lectura editorial cuidada).

### 2. Multimedia Engineer
- **Hero Video Player:**
  - Video de fondo a pantalla completa con overlay sutil.
  - Reproductor personalizable con selector para 2 teasers.
  - Barra de progreso (scrubber) interactiva cuyo indicador (thumb) sea un ícono SVG de pelota de fútbol que gire o avance con el tiempo.
- **Interactive PDF Viewer:**
  - Visor interactivo y ligero para leer el dossier/planteamiento sin ralentizar la carga inicial.

### 3. Backend & Forms Engineer
- Implementar el formulario de testimonios comunitarios.
- Validar inputs en el cliente y servidor.
- Procesar el envío directo hacia `rivasvaras.multimedia@gmail.com`.

## Convenciones de Código
- TypeScript en modo estricto.
- Componentes modulares bajo `/components/sections/` y `/components/ui/`.
- Uso de Server Actions para interacciones con servicios externos.