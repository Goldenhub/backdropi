import { useEditor } from '@/context/EditorContext'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { UnsplashIcon } from '@/components/ui/UnsplashIcon'
import { Palette, PaintBucket, ArrowRight, ArrowUpRight, ArrowUp, ArrowUpLeft, ArrowLeft, ArrowDownLeft, ArrowDown, ArrowDownRight, SlidersHorizontal } from 'lucide-react'
import type { Background } from '@/types'
import { UnsplashPicker } from '@/components/controls/UnsplashPicker'

const DIRECTION_ICONS = [ArrowRight, ArrowUpRight, ArrowUp, ArrowUpLeft, ArrowLeft, ArrowDownLeft, ArrowDown, ArrowDownRight]
const DIRECTION_VALUES = [0, 45, 90, 135, 180, 225, 270, 315]

export function BackgroundControls() {
  const { state, dispatch } = useEditor()
  const bg = state.background

  const setBackground = (b: Background) => dispatch({ type: 'SET_BACKGROUND', payload: b })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-1">
        {([
          { key: 'solid', icon: Palette, label: 'Solid' },
          { key: 'gradient', icon: PaintBucket, label: 'Gradient' },
          { key: 'unsplash', icon: UnsplashIcon, label: 'Unsplash' },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => {
              if (key === 'solid') setBackground({ type: 'solid', color: bg.type === 'solid' ? bg.color : '#e4e4e7' })
              else if (key === 'gradient') setBackground({ type: 'gradient', colors: bg.type === 'gradient' ? bg.colors : ['#a78bfa', '#f9a8d4'], direction: bg.type === 'gradient' ? bg.direction : 135 })
              else if (key === 'unsplash' && bg.type !== 'unsplash') setBackground({ type: 'unsplash', photoId: '', urls: { regular: '', small: '' }, authorName: '', authorLink: '' })
            }}
            className={`flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 active:scale-[0.97] ${
              bg.type === key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
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

      {bg.type === 'unsplash' && <UnsplashPicker />}
    </div>
  )
}
