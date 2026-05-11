import { useEffect, useRef } from 'react'
import { useEditor } from '@/context/EditorContext'
import { renderToCanvas } from '@/lib/canvas'

export function useCanvasRenderer(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const { state } = useEditor()
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(async () => {
      await renderToCanvas(ctx, state)
    })

    return () => cancelAnimationFrame(rafRef.current)
  }, [state, canvasRef])
}
