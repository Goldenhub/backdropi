import { useRef, useEffect, useState } from 'react'
import { useEditor } from '@/context/EditorContext'
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer'

export function Canvas() {
  const { state } = useEditor()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  useCanvasRenderer(canvasRef)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const size = state.canvasSize ?? { width: 800, height: 600 }
  const gap = 80
  const maxDisplayW = Math.max(640, containerSize.width - gap)
  const maxDisplayH = containerSize.height - gap
  const scale = Math.min(1, maxDisplayW / size.width, maxDisplayH / size.height)
  const displayW = Math.round(size.width * scale)
  const displayH = Math.round(size.height * scale)

  return (
    <div ref={containerRef} className="flex items-center justify-center flex-1 overflow-auto bg-muted">
      {!state.sourceImage ? (
        <p className="text-muted-foreground text-sm">Upload an image to begin</p>
      ) : (
        <canvas
          ref={canvasRef}
          width={size.width}
          height={size.height}
          style={{ width: displayW, height: displayH }}
          className="rounded-lg shadow-lg ring-1 ring-black/5"
        />
      )}
    </div>
  )
}
