import { useEditor } from '@/context/EditorContext'
import { Slider } from '@/components/ui/Slider'
import { Square, Expand } from 'lucide-react'
import { PADDING_MAX } from '@/lib/constants'

const RADIUS_PRESETS = [0, 8, 16, 32]

function cornerPath(r: number): string {
  const inset = 8
  const end = 64
  if (r === 0) return `M ${inset} ${end} V ${inset} H ${end}`
  const radius = Math.min(r, 40)
  const arcX = inset + radius
  const arcY = inset + radius
  return `M ${inset} ${end} V ${arcY} A ${radius} ${radius} 0 0 1 ${arcX} ${inset} H ${end}`
}

export function CornerControls() {
  const { state, dispatch } = useEditor()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Square className="w-3.5 h-3.5 text-muted-foreground" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Corners</h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {RADIUS_PRESETS.map((r) => (
          <button
            key={r}
            onClick={() => dispatch({ type: 'SET_CORNER_RADIUS', payload: r })}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all duration-150 ${
              state.cornerRadius === r
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:border-primary/50 hover:bg-accent'
            }`}
          >
            <svg viewBox="0 0 72 72" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d={cornerPath(r)} />
            </svg>
            <span className="text-[11px] font-medium text-muted-foreground">{r}px</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Expand className="w-3 h-3 text-muted-foreground" />
        <div className="flex-1">
          <Slider
            label="Padding"
            value={state.padding}
            min={0}
            max={PADDING_MAX}
            step={4}
            onChange={(v) => dispatch({ type: 'SET_PADDING', payload: v })}
          />
        </div>
      </div>
    </div>
  )
}
