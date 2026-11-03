import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { observeReveal, vars } from '../lib/motion'

interface Props {
  as?: 'div' | 'section' | 'article' | 'li'
  className?: string
  delay?: number
  glow?: boolean
  tilt?: boolean
  children: ReactNode
}

/** Fades/slides its content in once, the first time it scrolls into view. */
export function Reveal({ as = 'div', className = '', delay = 0, glow, tilt, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => (ref.current ? observeReveal(ref.current) : undefined), [])
  const Tag = as as 'div'
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={vars({ '--d': `${delay}ms` })}
      data-glow={glow ? '' : undefined}
      data-tilt={tilt ? '' : undefined}
    >
      {children}
    </Tag>
  )
}

/** Character-by-character text. The parent should carry the accessible label. */
export function Chars({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span key={i} className="ch" style={vars({ '--i': i + start })} aria-hidden="true">
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </>
  )
}

/** Word-by-word text. The parent should carry the accessible label. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="wd-mask" aria-hidden="true">
          <span className="wd" style={vars({ '--i': i + start })}>{w}</span>{' '}
        </span>
      ))}
    </>
  )
}
