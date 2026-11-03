import { useEffect, useRef } from 'react'
import { reducedMotion } from '../lib/motion'

/**
 * A few dozen slow silver dust motes on ONE canvas and ONE rAF loop.
 * Pauses when scrolled out of view or the tab is hidden; does nothing for reduced motion.
 */
export function Particles({ count = 48 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reducedMotion()) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const n = window.innerWidth < 640 ? Math.round(count * 0.5) : count
    const motes = Array.from({ length: n }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      v: Math.random() * 0.0004 + 0.00012,
      a: Math.random() * 0.5 + 0.2,
      p: Math.random() * Math.PI * 2,
    }))
    let w = 0
    let h = 0
    let raf = 0
    let visible = true

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#e4e7ec'
      for (const m of motes) {
        m.y -= m.v
        if (m.y < -0.02) m.y = 1.02
        ctx.globalAlpha = m.a * (0.55 + 0.45 * Math.sin(t * 0.0012 + m.p))
        ctx.beginPath()
        ctx.arc(m.x * w + Math.sin(t * 0.0003 + m.p) * 10, m.y * h, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    const onVis = () => (document.hidden ? stop() : start())

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? start() : stop()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', onVis)
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [count])

  return <canvas ref={ref} className="particles" aria-hidden="true" />
}
