import { Palette, CircleDotDashed, Square, Monitor } from 'lucide-react'

export type ToolId = 'background' | 'shadow' | 'corners' | 'mockup'

export interface ToolDef {
  id: ToolId
  icon: typeof Palette
  label: string
}

export const TOOLS: ToolDef[] = [
  { id: 'mockup', icon: Monitor, label: 'Mockup' },
  { id: 'background', icon: Palette, label: 'Background' },
  { id: 'shadow', icon: CircleDotDashed, label: 'Shadow' },
  { id: 'corners', icon: Square, label: 'Corners' },
]

interface ToolPaletteProps {
  activeTool: ToolId | null
  onSelect: (tool: ToolId | null) => void
}

export function ToolPalette({ activeTool, onSelect }: ToolPaletteProps) {
  return (
    <div className="flex flex-col gap-1 bg-white/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/[0.03] ring-1 ring-white/50 p-2">
      {TOOLS.map((t) => {
        const Icon = t.icon
        const isActive = activeTool === t.id
        return (
          <button
            key={t.id}
            onClick={() => onSelect(isActive ? null : t.id)}
            title={t.label}
            className={`flex flex-col items-center gap-1 w-16 py-2 rounded-lg transition-all duration-150 ${
              isActive
                ? 'text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
            }`}
            style={isActive ? { backgroundColor: '#b894c4' } : undefined}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] leading-tight font-medium">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
