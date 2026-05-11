import { Palette, CircleDotDashed, Square, ImageIcon } from 'lucide-react'

export type ToolId = 'background' | 'shadow' | 'corners' | 'unsplash'

export interface ToolDef {
  id: ToolId
  icon: typeof Palette
  label: string
}

export const TOOLS: ToolDef[] = [
  { id: 'background', icon: Palette, label: 'Background' },
  { id: 'shadow', icon: CircleDotDashed, label: 'Shadow' },
  { id: 'corners', icon: Square, label: 'Corners' },
  { id: 'unsplash', icon: ImageIcon, label: 'Unsplash' },
]

interface ToolPaletteProps {
  activeTool: ToolId | null
  onSelect: (tool: ToolId | null) => void
}

export function ToolPalette({ activeTool, onSelect }: ToolPaletteProps) {
  return (
    <div className="flex flex-col gap-1 bg-background rounded-xl shadow-lg ring-1 ring-black/5 p-1.5">
      {TOOLS.map((t) => {
        const Icon = t.icon
        const isActive = activeTool === t.id
        return (
          <button
            key={t.id}
            onClick={() => onSelect(isActive ? null : t.id)}
            title={t.label}
            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150 ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        )
      })}
    </div>
  )
}
