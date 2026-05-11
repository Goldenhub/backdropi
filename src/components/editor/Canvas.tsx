import { useRef } from 'react'
import { useEditor } from '@/context/EditorContext'
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer'

export function Canvas() {
  const { state } = useEditor()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useCanvasRenderer(canvasRef)

  const size = state.canvasSize ?? { width: 800, height: 600 }
  const maxW = 640
  const scale = Math.min(1, maxW / size.width)
  const displayW = Math.round(size.width * scale)
  const displayH = Math.round(size.height * scale)

  return (
    <div className="flex items-center justify-center flex-1 overflow-auto bg-muted">
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
