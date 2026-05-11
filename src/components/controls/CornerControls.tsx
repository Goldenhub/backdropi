import { useEditor } from '@/context/EditorContext'
import { Slider } from '@/components/ui/Slider'
import { Expand } from 'lucide-react'
import { PADDING_MAX } from '@/lib/constants'

const RADIUS_PRESETS = [0, 16, 64]

function CornerPreview({ r }: { r: number }) {
  const s = 180, pad = 14, end = 166
  const radius = Math.min(r, 140)
  const ax = pad + radius
  const ay = pad + radius

  const sharp = `M ${pad} ${end} V ${pad} H ${end}`
  const round = radius === 0 ? sharp : `M ${pad} ${end} V ${ay} A ${radius} ${radius} 0 0 1 ${ax} ${pad} H ${end}`
  const fill = radius === 0 ? '' : `M ${pad} ${pad} L ${pad} ${ay} A ${radius} ${radius} 0 0 0 ${ax} ${pad} Z`

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className="w-16 h-16" fill="none">
      <defs>
        <filter id={`shadow-${r}`}>
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.15" />
        </filter>
      </defs>
      {fill && <path d={fill} className="fill-primary/10" />}
      <path d={sharp} className="stroke-border" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
      <path
        d={round}
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#shadow-${r})`}
      />
    </svg>
  )
}

export function CornerControls() {
  const { state, dispatch } = useEditor()
  const isBrowser = state.mockupType === 'browser'

  if (isBrowser) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2.5">
          <span className="text-xs text-muted-foreground">
            Corner radius is not available in Browser mockup mode.
          </span>
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {RADIUS_PRESETS.map((r) => (
          <button
            key={r}
            onClick={() => dispatch({ type: 'SET_CORNER_RADIUS', payload: r })}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-150 ${
              state.cornerRadius === r
                ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-accent hover:shadow-sm'
            }`}
          >
            <CornerPreview r={r} />
            <span className="text-[11px] font-medium text-muted-foreground">{r}px</span>
          </button>
        ))}
      </div>

      <Slider
        label="Border radius"
        value={state.cornerRadius}
        min={0}
        max={128}
        onChange={(v) => dispatch({ type: 'SET_CORNER_RADIUS', payload: v })}
      />

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
