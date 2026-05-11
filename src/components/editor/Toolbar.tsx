import { useRef } from 'react'
import { useEditor } from '@/context/EditorContext'
import { useExport } from '@/hooks/useExport'
import { useImageUpload } from '@/hooks/useImageUpload'
import { Logo } from '@/components/ui/Logo'
import { Download, FileImage, Undo2, Redo2, Upload } from 'lucide-react'

export function Toolbar() {
  const { state, dispatch, canUndo, canRedo } = useEditor()
  const { export: handleExport } = useExport()
  const { loadImage } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="font-semibold text-sm tracking-tight text-foreground/80">backdropi</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5 bg-white/60 rounded-lg p-1 ring-1 ring-black/[0.03]">
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!canUndo}
            title="Undo (⌘Z)"
            className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={!canRedo}
            title="Redo (⇧⌘Z)"
            className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-5 bg-border/50" />

        <div className="flex items-center gap-1.5 bg-white/60 rounded-lg p-1 ring-1 ring-black/[0.03]">
          {state.sourceImage && (
            <button
              onClick={() => inputRef.current?.click()}
              title="Replace screenshot"
              className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/60 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => dispatch({ type: 'SET_EXPORT_FORMAT', payload: 'png' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              state.exportFormat === 'png'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileImage className="w-3.5 h-3.5" />
            PNG
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_EXPORT_FORMAT', payload: 'jpeg' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              state.exportFormat === 'jpeg'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileImage className="w-3.5 h-3.5" />
            JPEG
          </button>
        </div>

        {state.sourceImage && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white shadow-sm transition-all duration-150 active:scale-[0.97]"
            style={{ backgroundColor: '#b894c4' }}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        )}
      </div>

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
    </header>
  )
}
