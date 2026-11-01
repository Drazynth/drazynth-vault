import { useCallback, useEffect, useRef, useState } from 'react'
import { listResources } from './sanity'
import type { ListOptions } from './sanity'
import type { ResourceSummary } from './types'

export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | DRAZYNTH VAULT` : 'DRAZYNTH VAULT'
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: boolean
  retry: () => void
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: boolean }>({
    data: null,
    loading: true,
    error: false,
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: false }))
    fn()
      .then((data) => !cancelled && setState({ data, loading: false, error: false }))
      .catch(() => !cancelled && setState({ data: null, loading: false, error: true }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, retry }
}

/** Paged list with "Load more". Resets whenever the options change. */
export function useResourceList(options: ListOptions, pageSize: number) {
  const [items, setItems] = useState<ResourceSummary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const key = JSON.stringify(options)
  const latest = useRef(key)

  useEffect(() => {
    latest.current = key
    setLoading(true)
    setError(false)
    listResources({ ...options, offset: 0, limit: pageSize })
      .then((r) => {
        if (latest.current !== key) return
        setItems(r.items)
        setTotal(r.total)
        setLoading(false)
      })
      .catch(() => {
        if (latest.current !== key) return
        setError(true)
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, pageSize, attempt])

  const loadMore = useCallback(() => {
    setLoadingMore(true)
    listResources({ ...options, offset: items.length, limit: pageSize })
      .then((r) => {
        if (latest.current !== key) return
        setItems((prev) => [...prev, ...r.items])
        setTotal(r.total)
      })
      .catch(() => setError(true))
      .finally(() => setLoadingMore(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, items.length, pageSize])

  return {
    items,
    total,
    loading,
    loadingMore,
    error,
    hasMore: items.length < total,
    loadMore,
    retry: () => setAttempt((a) => a + 1),
  }
}
