import { useCallback, useRef } from 'react'
import { useEditor } from '@/context/EditorContext'
import { renderToCanvas } from '@/lib/canvas'
import { exportCanvas } from '@/lib/export'

export function useExport() {
  const { state } = useEditor()
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null)

  if (!exportCanvasRef.current) {
    exportCanvasRef.current = document.createElement('canvas')
  }

  const handleExport = useCallback(async () => {
    const canvas = exportCanvasRef.current!
    const size = state.canvasSize ?? { width: 1200, height: 800 }
    canvas.width = size.width * 2
    canvas.height = size.height * 2
    const ctx = canvas.getContext('2d')!
    ctx.scale(2, 2)
    await renderToCanvas(ctx, state)
    exportCanvas(canvas, state.exportFormat, state.exportQuality)
  }, [state])

  return { export: handleExport }
}
