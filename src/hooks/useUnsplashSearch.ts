import { useState, useCallback, useRef, useEffect } from 'react'
import type { UnsplashPhoto } from '@/types'

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined

export function useUnsplashSearch() {
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const search = useCallback(async (q: string) => {
    if (!q.trim() || !ACCESS_KEY) {
      setPhotos([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=20`,
        { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
      )
      if (!res.ok) throw new Error(`Unsplash error: ${res.status}`)
      const data = await res.json()
      setPhotos(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search Unsplash')
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(query), 400)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, search])

  return { query, setQuery, photos, loading, error }
}
