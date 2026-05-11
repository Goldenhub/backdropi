import { useCallback, useEffect, useRef, useState } from 'react'
import { useImageUpload } from '@/hooks/useImageUpload'
import { Upload, Clipboard } from 'lucide-react'

export function DropZone() {
  const { loadImage } = useImageUpload()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    loadImage(file)
  }, [loadImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) handleFile(file)
        break
      }
    }
  }, [handleFile])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  return (
    <div className="flex flex-col items-center justify-center min-h-[320px]">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer bg-white/40 backdrop-blur-sm ${
          dragging
            ? 'border-primary/60 bg-primary/[0.06] scale-[1.02]'
            : 'border-white/40 hover:border-primary/40 hover:bg-white/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <Upload className="w-6 h-6" style={{ color: '#b894c4' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground/80">Drop a screenshot here</p>
            <p className="text-xs text-muted-foreground/70 mt-1">or click to browse</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground/70">
        <Clipboard className="w-3 h-3" />
        <span>Paste from clipboard also works</span>
      </div>
    </div>
  )
}
