import { useState, useCallback, useRef, useEffect } from 'react'
import type { UnsplashPhoto } from '@/types'

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined
const PER_PAGE = 9

export function useUnsplashSearch() {
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const mountedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const search = useCallback(async (q: string, pageNum: number, append: boolean) => {
    if (!q.trim() || !ACCESS_KEY) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${PER_PAGE}&page=${pageNum}`,
        { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
      )
      if (!res.ok) throw new Error(`Unsplash error: ${res.status}`)
      const data = await res.json()
      setPhotos(append ? (prev) => [...prev, ...data.results] : data.results)
      setTotalPages(data.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadRandom = useCallback(async () => {
    if (!ACCESS_KEY) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?count=${PER_PAGE}`,
        { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
      )
      if (!res.ok) throw new Error(`Unsplash error: ${res.status}`)
      const data = await res.json()
      setPhotos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    const nextPage = page + 1
    if (nextPage > totalPages) return
    setPage(nextPage)
    if (query.trim()) {
      search(query, nextPage, true)
    }
  }, [query, page, totalPages, search])

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      loadRandom()
    }
  }, [loadRandom])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!query.trim()) return
    timerRef.current = setTimeout(() => {
      setPage(1)
      search(query, 1, false)
    }, 400)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, search])

  const hasMore = query.trim() ? page < totalPages : false

  return { query, setQuery, photos, loading, error, loadMore, hasMore }
}
