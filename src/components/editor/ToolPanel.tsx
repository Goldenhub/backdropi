import type { ToolId } from './ToolPalette'
import { TOOLS } from './ToolPalette'
import { X } from 'lucide-react'
import { BackgroundControls } from '@/components/controls/BackgroundControls'
import { ShadowControls } from '@/components/controls/ShadowControls'
import { CornerControls } from '@/components/controls/CornerControls'

const TOOL_PANELS: Record<ToolId, () => React.ReactNode> = {
  background: BackgroundControls,
  shadow: ShadowControls,
  corners: CornerControls,
}

interface ToolPanelProps {
  tool: ToolId
  onClose: () => void
}

export function ToolPanel({ tool, onClose }: ToolPanelProps) {
  const def = TOOLS.find((t) => t.id === tool)
  if (!def) return null

  const Icon = def.icon
  const Panel = TOOL_PANELS[tool]

  return (
    <div className="bg-background rounded-xl shadow-lg ring-1 ring-black/5 p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-foreground" />
          <h2 className="text-sm font-semibold text-foreground">{def.label}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <Panel />
    </div>
  )
}
