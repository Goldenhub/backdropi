import { useEffect } from 'react'
import { useEditor } from '@/context/EditorContext'
import { renderToCanvas } from '@/lib/canvas'

export function useCanvasRenderer(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const { state } = useEditor()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cancelled = false

    const render = async () => {
      const offscreen = document.createElement('canvas')
      offscreen.width = canvas.width
      offscreen.height = canvas.height
      const offCtx = offscreen.getContext('2d')!
      await renderToCanvas(offCtx, state)
      if (cancelled) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(offscreen, 0, 0)
    }

    const rafId = requestAnimationFrame(() => render())
    return () => { cancelled = true; cancelAnimationFrame(rafId) }
  }, [state, canvasRef])
}
