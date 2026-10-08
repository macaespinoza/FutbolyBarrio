'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { NAV_ITEMS } from '@/lib/content'

interface BallState {
  x: number
  y: number
  rotation: number
  opacity: number
  scale: number
  visible: boolean
}

export default function Navbar() {
  const navRef = useRef<HTMLUListElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<string>('#documental')
  const [ballState, setBallState] = useState<BallState>({
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 0,
    scale: 1,
    visible: false,
  })

  const updateBallPosition = useCallback((targetIdx: number | null, isHovered = false) => {
    if (targetIdx === null || targetIdx < 0) {
      setBallState((prev) => ({ ...prev, opacity: 0, visible: false }))
      return
    }

    const navEl = navRef.current
    const linkEl = linkRefs.current[targetIdx]
    if (!navEl || !linkEl) return

    const navRect = navEl.getBoundingClientRect()
    const linkRect = linkEl.getBoundingClientRect()

    const ballSize = 22
    const gap = 8
    const targetX = linkRect.left - navRect.left - ballSize - gap
    const targetY = linkRect.top - navRect.top + linkRect.height / 2 - ballSize / 2

    setBallState((prev) => {
      const deltaX = targetX - (prev.visible ? prev.x : targetX)
      return {
        x: targetX,
        y: targetY,
        rotation: prev.rotation + deltaX * 3.5,
        opacity: 1,
        scale: isHovered ? 1.2 : 1.0,
        visible: true,
      }
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i]
        if (!item) continue
        const el = document.getElementById(item.href.substring(1))
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(item.href)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sync = () => {
      const activeIdx = NAV_ITEMS.findIndex((item) => item.href === activeSection)
      const targetIdx = hoveredIndex !== null ? hoveredIndex : activeIdx !== -1 ? activeIdx : 0
      updateBallPosition(targetIdx, hoveredIndex !== null)
    }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [hoveredIndex, activeSection, updateBallPosition])

  return (
    <header className="navbar">
      <a href="#" className="nav-brand" title="Fútbol y Barrio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logov1.svg" alt="Fútbol y Barrio" className="nav-logo" />
      </a>

      <ul className="nav-links" ref={navRef} onMouseLeave={() => setHoveredIndex(null)}>
        <div
          className="nav-ball-indicator"
          style={{
            transform: `translate3d(${ballState.x}px, ${ballState.y}px, 0) scale(${ballState.scale})`,
            opacity: ballState.opacity,
          }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pelota.png"
            alt=""
            className="nav-ball-img"
            style={{ transform: `rotate(${ballState.rotation}deg)` }}
          />
        </div>

        {NAV_ITEMS.map((item, index) => {
          const isActive = activeSection === item.href
          const isHovered = hoveredIndex === index
          return (
            <li key={item.href}>
              <a
                href={item.href}
                ref={(el) => {
                  linkRefs.current[index] = el
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`nav-item-link ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
      <div className="nav-spacer" aria-hidden="true" />
    </header>
  )
}
