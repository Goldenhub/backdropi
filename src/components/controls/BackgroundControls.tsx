import { useEditor } from '@/context/EditorContext'
import { Palette, PaintBucket, Image, SlidersHorizontal } from 'lucide-react'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { ColorSwatches } from '@/components/ui/ColorSwatches'
import { UnsplashPicker } from './UnsplashPicker'
import { UnsplashIcon } from '@/components/ui/UnsplashIcon'
import type { Background } from '@/types'
import { useRef } from 'react'

const DIRECTION_VALUES = [0, 45, 90, 135, 180, 225, 270, 315]

export function BackgroundControls() {
  const { state, dispatch } = useEditor()
  const bg = state.background
  const setBackground = (b: Background) => dispatch({ type: 'SET_BACKGROUND', payload: b })
  const imageInputRef = useRef<HTMLInputElement>(null)

  const tabs = [
    { key: 'solid', icon: Palette, label: 'Color' },
    { key: 'gradient', icon: PaintBucket, label: 'Gradient' },
    { key: 'image', icon: Image, label: 'Image' },
    { key: 'unsplash', icon: UnsplashIcon, label: 'Unsplash' },
  ] as const

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => {
              if (key === 'solid') setBackground({ type: 'solid', color: bg.type === 'solid' ? bg.color : '#e4e4e7' })
              else if (key === 'gradient') setBackground({ type: 'gradient', colors: bg.type === 'gradient' ? bg.colors : ['#a78bfa', '#f9a8d4'], direction: bg.type === 'gradient' ? bg.direction : 135 })
              else if (key === 'image') imageInputRef.current?.click()
              else if (key === 'unsplash' && bg.type !== 'unsplash') setBackground({ type: 'unsplash', photoId: '', urls: { regular: '', small: '' }, authorName: '', authorLink: '' })
            }}
            className={`group relative flex items-center justify-center p-2 rounded-lg transition-all duration-150 active:scale-[0.97] ${
              bg.type === key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[11px] font-medium text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap">
              {label}
            </div>
          </button>
        ))}
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = (ev) => {
            setBackground({ type: 'image', src: ev.target?.result as string, fit: 'cover' })
          }
          reader.readAsDataURL(file)
        }}
      />

      {bg.type === 'solid' && (
        <div className="space-y-4">
          <ColorPicker label="Color" value={bg.color} onChange={(color) => setBackground({ type: 'solid', color })} />
          <ColorSwatches value={bg.color} onChange={(color) => setBackground({ type: 'solid', color })} label="From image" />
        </div>
      )}

      {bg.type === 'gradient' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <ColorPicker label="Start" value={bg.colors[0]} onChange={(c) => setBackground({ ...bg, colors: [c, bg.colors[1]] })} />
            <ColorPicker label="End" value={bg.colors[1]} onChange={(c) => setBackground({ ...bg, colors: [bg.colors[0], c] })} />
          </div>
          <ColorSwatches value={bg.colors[0]} onChange={(c) => setBackground({ ...bg, colors: [c, bg.colors[1]] })} label="From image" />
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <SlidersHorizontal className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Direction</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {DIRECTION_VALUES.map((val) => (
                <button
                  key={val}
                  onClick={() => setBackground({ ...bg, direction: val })}
                  className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                    bg.direction === val
                      ? 'border-primary shadow-sm'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(${val + 90}deg, ${bg.colors[0]}, ${bg.colors[1]})`,
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-muted-foreground">Angle</span>
                <span className="text-[11px] font-mono text-muted-foreground tabular-nums">{bg.direction}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={bg.direction}
                onChange={(e) => setBackground({ ...bg, direction: Number(e.target.value) })}
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(bg.direction / 360) * 100}%, var(--color-secondary) ${(bg.direction / 360) * 100}%, var(--color-secondary) 100%)`,
                }}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer transition-all duration-150
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-background
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-primary
                  [&::-webkit-slider-thumb]:shadow-sm
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:duration-150
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-webkit-slider-thumb]:active:scale-95"
              />
            </div>
          </div>
        </div>
      )}

      {bg.type === 'image' && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground shrink-0">Fit</span>
          <div className="flex gap-1">
            {(['cover', 'contain', 'fill'] as const).map((fit) => (
              <button
                key={fit}
                onClick={() => setBackground({ ...bg, fit })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                  bg.fit === fit
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>
      )}

      {bg.type === 'unsplash' && <UnsplashPicker />}
    </div>
  )
}
