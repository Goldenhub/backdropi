import { useEditor } from '@/context/EditorContext'
import { Slider } from '@/components/ui/Slider'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { CircleDotDashed } from 'lucide-react'

export function ShadowControls() {
  const { state, dispatch } = useEditor()
  const s = state.shadow

  const setShadow = (partial: Partial<typeof s>) => dispatch({ type: 'SET_SHADOW', payload: partial })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CircleDotDashed className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Shadow</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={s.enabled}
            onChange={(e) => setShadow({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-150 after:shadow-sm" />
        </label>
      </div>

      {s.enabled && (
        <div className="space-y-3">
          <Slider label="Offset X" value={s.offsetX} min={-50} max={50} onChange={(v) => setShadow({ offsetX: v })} />
          <Slider label="Offset Y" value={s.offsetY} min={-50} max={50} onChange={(v) => setShadow({ offsetY: v })} />
          <Slider label="Blur" value={s.blur} min={0} max={100} onChange={(v) => setShadow({ blur: v })} />
          <Slider label="Spread" value={s.spread} min={-50} max={50} onChange={(v) => setShadow({ spread: v })} />
          <ColorPicker label="Color" value={s.color} onChange={(c) => setShadow({ color: c })} />
        </div>
      )}
    </div>
  )
}
