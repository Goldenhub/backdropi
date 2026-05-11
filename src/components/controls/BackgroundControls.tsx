import { useEditor } from '@/context/EditorContext'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { Palette, PaintBucket, ArrowRight, ArrowUpRight, ArrowUp, ArrowUpLeft, ArrowLeft, ArrowDownLeft, ArrowDown, ArrowDownRight, SlidersHorizontal } from 'lucide-react'
import type { Background } from '@/types'
import { Button } from '@/components/ui/Button'

const DIRECTION_ICONS = [ArrowRight, ArrowUpRight, ArrowUp, ArrowUpLeft, ArrowLeft, ArrowDownLeft, ArrowDown, ArrowDownRight]
const DIRECTION_VALUES = [0, 45, 90, 135, 180, 225, 270, 315]

export function BackgroundControls() {
  const { state, dispatch } = useEditor()
  const bg = state.background

  const setBackground = (b: Background) => dispatch({ type: 'SET_BACKGROUND', payload: b })

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Background</h3>

      <div className="flex gap-2">
        <Button
          variant={bg.type === 'solid' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setBackground({ type: 'solid', color: bg.type === 'solid' ? bg.color : '#e4e4e7' })}
        >
          <Palette className="w-3.5 h-3.5" />
          Solid
        </Button>
        <Button
          variant={bg.type === 'gradient' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setBackground({
            type: 'gradient',
            colors: bg.type === 'gradient' ? bg.colors : ['#a78bfa', '#f9a8d4'],
            direction: bg.type === 'gradient' ? bg.direction : 135,
          })}
        >
          <PaintBucket className="w-3.5 h-3.5" />
          Gradient
        </Button>
      </div>

      {bg.type === 'solid' && (
        <ColorPicker label="Color" value={bg.color} onChange={(color) => setBackground({ type: 'solid', color })} />
      )}

      {bg.type === 'gradient' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <ColorPicker label="Start" value={bg.colors[0]} onChange={(c) => setBackground({ ...bg, colors: [c, bg.colors[1]] })} />
            <ColorPicker label="End" value={bg.colors[1]} onChange={(c) => setBackground({ ...bg, colors: [bg.colors[0], c] })} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <SlidersHorizontal className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Direction</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {DIRECTION_VALUES.map((val, i) => {
                const Icon = DIRECTION_ICONS[i]
                return (
                  <button
                    key={val}
                    onClick={() => setBackground({ ...bg, direction: val })}
                    className={`flex items-center justify-center w-full aspect-square rounded-lg text-xs transition-all duration-150 ${
                      bg.direction === val
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                )
              })}
            </div>
            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={360}
                value={bg.direction}
                onChange={(e) => setBackground({ ...bg, direction: Number(e.target.value) })}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
