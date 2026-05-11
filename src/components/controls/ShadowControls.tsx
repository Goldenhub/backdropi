import { useEditor } from '@/context/EditorContext'
import { Slider } from '@/components/ui/Slider'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { SHADOW_PRESETS } from '@/lib/constants'
import type { ShadowPreset } from '@/lib/constants'
import { CircleDotDashed, Check } from 'lucide-react'

function getOpacity(color: string): number {
  if (color.length === 9) {
    return Math.round((parseInt(color.slice(7, 9), 16) / 255) * 100)
  }
  return 100
}

function setOpacity(color: string, opacity: number): string {
  const alpha = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0')
  return color.slice(0, 7) + alpha
}

function getAlphaHex(color: string): string {
  return color.length === 9 ? color.slice(7, 9) : 'ff'
}

function matchesPreset(s: ShadowPreset, offsetX: number, offsetY: number, blur: number, spread: number) {
  return s.offsetX === offsetX && s.offsetY === offsetY && s.blur === blur && s.spread === spread
}

function PresetCard({ preset, active, onClick }: { preset: ShadowPreset; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150 ${
        active
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-transparent bg-secondary/50 hover:border-border hover:bg-secondary'
      }`}
    >
      {active && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
      )}
      <div
        className="w-full h-12 rounded-lg bg-background ring-1 ring-border/50"
        style={{
          boxShadow: `${preset.offsetX}px ${preset.offsetY}px ${preset.blur}px ${preset.spread}px ${preset.color}`,
        }}
      />
      <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {preset.label}
      </span>
    </button>
  )
}

export function ShadowControls() {
  const { state, dispatch } = useEditor()
  const s = state.shadow

  const setShadow = (partial: Partial<typeof s>) => dispatch({ type: 'SET_SHADOW', payload: partial })
  const opacity = getOpacity(s.color)

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
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Presets</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SHADOW_PRESETS.map((preset, i) => (
              <PresetCard
                key={i}
                preset={preset}
                active={matchesPreset(preset, s.offsetX, s.offsetY, s.blur, s.spread)}
                onClick={() => setShadow(preset)}
              />
            ))}
          </div>

          <Slider label="Blur" value={s.blur} min={0} max={100} onChange={(v) => setShadow({ blur: v })} />
          <Slider label="Opacity" value={opacity} min={0} max={100} onChange={(v) => setShadow({ color: setOpacity(s.color, v) })} />
          <ColorPicker label="Color" value={s.color.slice(0, 7)} onChange={(c) => setShadow({ color: c + getAlphaHex(s.color) })} />
        </>
      )}
    </div>
  )
}
