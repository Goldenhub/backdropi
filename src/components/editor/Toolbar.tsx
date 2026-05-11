import { useEditor } from '@/context/EditorContext'
import { useExport } from '@/hooks/useExport'
import { Button } from '@/components/ui/Button'
import { Download, Image, FileImage } from 'lucide-react'

export function Toolbar() {
  const { state, dispatch } = useEditor()
  const { export: handleExport } = useExport()

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-background">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Image className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm tracking-tight">backdropi</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-secondary rounded-lg p-1">
          <button
            onClick={() => dispatch({ type: 'SET_EXPORT_FORMAT', payload: 'png' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              state.exportFormat === 'png'
                ? 'bg-background text-foreground shadow-sm'
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
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileImage className="w-3.5 h-3.5" />
            JPEG
          </button>
        </div>

        {state.sourceImage && (
          <Button variant="primary" size="sm" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        )}
      </div>
    </header>
  )
}
