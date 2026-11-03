import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'

interface Props {
  value?: string
  placeholder?: string
  onSubmit: (q: string) => void
  onClear?: () => void
  large?: boolean
  label?: string
}

export function SearchBox({ value = '', placeholder = 'Search presets, effects, APKs, SFX, overlays', onSubmit, onClear, large, label = 'Search resources' }: Props) {
  const [text, setText] = useState(value)
  useEffect(() => setText(value), [value])
  return (
    <form
      className={`searchbox ${large ? 'searchbox-lg' : ''}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(text.trim())
      }}
    >
      <Search size={17} aria-hidden="true" className="searchbox-icon" />
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        maxLength={80}
      />
      {text && (
        <button
          type="button"
          className="icon-btn"
          aria-label="Clear search"
          onClick={() => {
            setText('')
            onClear?.()
          }}
        >
          <X size={16} />
        </button>
      )}
      <button type="submit" className="btn btn-primary searchbox-go">Search</button>
    </form>
  )
}
