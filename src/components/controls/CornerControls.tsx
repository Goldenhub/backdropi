import { useEditor } from '@/context/EditorContext'
import { Slider } from '@/components/ui/Slider'
import { Square, Expand } from 'lucide-react'

export function CornerControls() {
  const { state, dispatch } = useEditor()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Square className="w-3.5 h-3.5 text-muted-foreground" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Corners</h3>
      </div>
      <Slider
        label="Border radius"
        value={state.cornerRadius}
        min={0}
        max={64}
        onChange={(v) => dispatch({ type: 'SET_CORNER_RADIUS', payload: v })}
      />
      <div className="flex items-center gap-2">
        <Expand className="w-3 h-3 text-muted-foreground" />
        <div className="flex-1">
          <Slider
            label="Padding"
            value={state.padding}
            min={0}
            max={200}
            step={4}
            onChange={(v) => dispatch({ type: 'SET_PADDING', payload: v })}
          />
        </div>
      </div>
    </div>
  )
}
