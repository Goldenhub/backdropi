import { useRef, useEffect, useState } from 'react'
import { useEditor } from '@/context/EditorContext'
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer'
import { useImageUpload } from '@/hooks/useImageUpload'
import { Upload } from 'lucide-react'

export function Canvas() {
  const { state } = useEditor()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [hovering, setHovering] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { loadImage } = useImageUpload()
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
    <div ref={containerRef} className="flex items-center justify-center flex-1 overflow-auto">
      {!state.sourceImage ? (
        <p className="text-muted-foreground/60 text-sm">Upload an image to begin</p>
      ) : (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={size.width}
            height={size.height}
            style={{ width: displayW, height: displayH }}
            className="rounded-xl shadow-2xl shadow-black/[0.08]"
          />
          <button
            onClick={() => inputRef.current?.click()}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/70 backdrop-blur-md border border-white/50 shadow-sm transition-all duration-150 ${
              hovering
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-1'
            } hover:bg-white/90 active:scale-[0.97]`}
          >
            <Upload className="w-3 h-3" />
            Replace
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) loadImage(file)
              e.target.value = ''
            }}
          />
        </div>
      )}
    </div>
  )
}
