import type { ToolId } from './ToolPalette'
import { TOOLS } from './ToolPalette'
import { X } from 'lucide-react'
import { BackgroundControls } from '@/components/controls/BackgroundControls'
import { ShadowControls } from '@/components/controls/ShadowControls'
import { CornerControls } from '@/components/controls/CornerControls'
import { MockupControls } from '@/components/controls/MockupControls'

const TOOL_PANELS: Record<ToolId, () => React.ReactNode> = {
  background: BackgroundControls,
  shadow: ShadowControls,
  corners: CornerControls,
  mockup: MockupControls,
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
    <div className="bg-white/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/[0.03] ring-1 ring-white/50 p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-foreground/70" />
          <h2 className="text-sm font-semibold text-foreground/80">{def.label}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <Panel />
    </div>
  )
}
