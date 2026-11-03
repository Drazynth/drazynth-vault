import { useEffect } from 'react'
import type { CSSProperties, RefObject } from 'react'

/** Typed helper for setting CSS custom properties from React (e.g. stagger index). */
export const vars = (o: Record<string, string | number>) => o as CSSProperties

export function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/* One shared IntersectionObserver for every scroll-reveal on the site. */
let io: IntersectionObserver | null = null

export function observeReveal(el: Element): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    el.setAttribute('data-in', '')
    return () => {}
  }
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '')
            io?.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
  }
  io.observe(el)
  return () => io?.unobserve(el)
}

/**
 * ONE delegated pointer listener (throttled with rAF) drives every hover effect:
 * cursor spotlight + border glow ([data-glow]), 3D tilt ([data-tilt]) and
 * magnetic buttons ([data-magnetic]). Only runs for fine pointers (mouse/trackpad).
 */
export function usePointerEffects() {
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    let last: PointerEvent | null = null
    let magnet: HTMLElement | null = null

    const frame = () => {
      raf = 0
      const e = last
      if (!e) return
      const t = e.target instanceof Element ? e.target : null
      const glow = t?.closest<HTMLElement>('[data-glow]') ?? null
      if (glow) {
        const r = glow.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        glow.style.setProperty('--gx', `${x.toFixed(0)}px`)
        glow.style.setProperty('--gy', `${y.toFixed(0)}px`)
        if (glow.hasAttribute('data-tilt')) {
          glow.style.setProperty('--rx', `${((0.5 - y / r.height) * 7).toFixed(2)}deg`)
          glow.style.setProperty('--ry', `${((x / r.width - 0.5) * 9).toFixed(2)}deg`)
        }
      }
      const m = t?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (magnet && magnet !== m) {
        magnet.style.setProperty('--mx', '0px')
        magnet.style.setProperty('--my', '0px')
      }
      magnet = m
      if (m) {
        const r = m.getBoundingClientRect()
        m.style.setProperty('--mx', `${((e.clientX - (r.left + r.width / 2)) * 0.16).toFixed(1)}px`)
        m.style.setProperty('--my', `${((e.clientY - (r.top + r.height / 2)) * 0.22).toFixed(1)}px`)
      }
    }
    const onMove = (e: PointerEvent) => {
      last = e
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const onOut = (e: PointerEvent) => {
      const t = e.target instanceof Element ? e.target : null
      const el = t?.closest<HTMLElement>('[data-tilt],[data-magnetic]')
      if (!el || (e.relatedTarget instanceof Node && el.contains(e.relatedTarget))) return
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--mx', '0px')
      el.style.setProperty('--my', '0px')
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

/** One passive scroll listener: progress bar, header state and light parallax. */
export function useScrollEffects(header: RefObject<HTMLElement>, bar: RefObject<HTMLElement>) {
  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`
      header.current?.classList.toggle('is-scrolled', y > 12)
      if (!reducedMotion()) {
        document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const k = Number(el.dataset.parallax) || 0.1
          el.style.transform = `translate3d(0, ${(Math.min(y, 900) * k).toFixed(1)}px, 0)`
        })
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(run)
    }
    run()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [header, bar])
}
