'use client'

import { useState, useEffect, useCallback } from 'react'

export type VideoQuality = '1080p' | '720p' | '480p'
export type QualityMode = 'auto' | '1080p' | '720p' | '480p'

export interface NetworkSpeedInfo {
  downlink?: number // Mbps
  effectiveType?: string // 'slow-2g' | '2g' | '3g' | '4g'
  rtt?: number // ms
  saveData?: boolean
  isSlow: boolean
  description: string
}

interface NetworkInformation extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  downlink?: number
  rtt?: number
  saveData?: boolean
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

const STORAGE_KEY = 'futbolybarrio_video_quality'

function evaluateConnection(): { quality: VideoQuality; info: NetworkSpeedInfo } {
  if (typeof window === 'undefined') {
    return {
      quality: '1080p',
      info: {
        isSlow: false,
        description: 'Detección automática',
      },
    }
  }

  const nav = navigator as NavigatorWithConnection
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection

  if (conn) {
    const saveData = Boolean(conn.saveData)
    const effectiveType = conn.effectiveType
    const downlink = conn.downlink
    const rtt = conn.rtt

    // Si el usuario tiene ahorro de datos activado en su navegador/celular
    if (saveData) {
      return {
        quality: '480p',
        info: {
          saveData: true,
          effectiveType,
          downlink,
          rtt,
          isSlow: true,
          description: 'Ahorro de datos activo (480p)',
        },
      }
    }

    // Conexiones 2G o slow-2g
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return {
        quality: '480p',
        info: {
          saveData: false,
          effectiveType,
          downlink,
          rtt,
          isSlow: true,
          description: `Conexión ${effectiveType.toUpperCase()} (480p ahorro)`,
        },
      }
    }

    // Si tenemos estimación de ancho de banda (downlink en Mbps)
    // 1080p WebM pesa 136MB para 2:14 min (~8.1 Mbps tasa sostenida)
    // 720p WebM pesa 41MB para 2:14 min (~2.4 Mbps tasa sostenida)
    // 480p WebM pesa 20.6MB para 2:14 min (~1.2 Mbps tasa sostenida)
    if (typeof downlink === 'number') {
      if (downlink < 2.0) {
        return {
          quality: '480p',
          info: {
            saveData: false,
            effectiveType,
            downlink,
            rtt,
            isSlow: true,
            description: `Conexión baja (${downlink.toFixed(1)} Mbps • 480p)`,
          },
        }
      }

      if (downlink < 5.5) {
        return {
          quality: '720p',
          info: {
            saveData: false,
            effectiveType,
            downlink,
            rtt,
            isSlow: true,
            description: `Conexión moderada (${downlink.toFixed(1)} Mbps • 720p)`,
          },
        }
      }

      return {
        quality: '1080p',
        info: {
          saveData: false,
          effectiveType,
          downlink,
          rtt,
          isSlow: false,
          description: `Alta velocidad (${downlink.toFixed(1)} Mbps • 1080p HD)`,
        },
      }
    }

    // Conexión 3G sin downlink exacto
    if (effectiveType === '3g') {
      return {
        quality: '720p',
        info: {
          saveData: false,
          effectiveType,
          downlink,
          rtt,
          isSlow: true,
          description: 'Conexión 3G (720p fluido)',
        },
      }
    }

    if (effectiveType === '4g') {
      return {
        quality: '1080p',
        info: {
          saveData: false,
          effectiveType,
          downlink,
          rtt,
          isSlow: false,
          description: 'Conexión 4G (1080p HD)',
        },
      }
    }
  }

  // Fallback si Network Information API no está soportada (Safari / Firefox / iOS)
  const isMobileScreen = window.innerWidth < 640
  if (isMobileScreen) {
    return {
      quality: '720p',
      info: {
        isSlow: false,
        description: 'Optimizado para pantalla móvil (720p)',
      },
    }
  }

  return {
    quality: '1080p',
    info: {
      isSlow: false,
      description: 'Conexión estándar (1080p HD)',
    },
  }
}

export function useConnectionSpeed() {
  const [qualityMode, setQualityModeState] = useState<QualityMode>('auto')
  const [detectedQuality, setDetectedQuality] = useState<VideoQuality>('1080p')
  const [speedInfo, setSpeedInfo] = useState<NetworkSpeedInfo>({
    isSlow: false,
    description: 'Detección automática de velocidad',
  })

  // Detectar y actualizar estado de red
  const checkNetwork = useCallback(() => {
    const { quality, info } = evaluateConnection()
    setDetectedQuality((prev) => (prev !== quality ? quality : prev))
    setSpeedInfo((prev) => (prev.description !== info.description ? info : prev))
  }, [])

  useEffect(() => {
    // 1. Cargar preferencia manual guardada si existe
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as QualityMode | null
      if (saved === 'auto' || saved === '1080p' || saved === '720p' || saved === '480p') {
        setQualityModeState((prev) => (prev !== saved ? saved : prev))
      }
    } catch {
      // Ignorar si localStorage está bloqueado
    }

    // 2. Primera comprobación
    checkNetwork()

    // 3. Listener a cambios de red en navegadores Chromium/Android
    const nav = navigator as NavigatorWithConnection
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection

    if (conn && conn.addEventListener) {
      const handleChange = () => checkNetwork()
      conn.addEventListener('change', handleChange)
      return () => {
        conn.removeEventListener('change', handleChange)
      }
    }

    // 4. Fallback: prueba de velocidad rápida y no invasiva para Safari/Firefox si conn no está disponible
    if (!conn) {
      const probeStart = performance.now()
      fetch('/pelota.png?probe=' + Date.now(), { cache: 'no-store' })
        .then((res) => {
          if (res.ok) {
            const durationMs = performance.now() - probeStart
            if (durationMs > 500) {
              setDetectedQuality('480p')
              setSpeedInfo({
                isSlow: true,
                description: 'Conexión muy lenta detectada (480p ahorro)',
              })
            } else if (durationMs > 250) {
              setDetectedQuality('720p')
              setSpeedInfo({
                isSlow: true,
                description: 'Conexión moderada detectada (720p adaptativo)',
              })
            }
          }
        })
        .catch(() => {
          // Si falla la prueba de red, mantener fallback seguro
        })
    }
  }, [checkNetwork])

  // Modificar preferencia del usuario
  const setQualityMode = useCallback((mode: QualityMode) => {
    setQualityModeState(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Ignorar error de cuota o modo incógnito
    }
  }, [])

  const currentQuality: VideoQuality = qualityMode === 'auto' ? detectedQuality : qualityMode

  return {
    qualityMode,
    setQualityMode,
    detectedQuality,
    currentQuality,
    speedInfo,
    isAuto: qualityMode === 'auto',
  }
}
