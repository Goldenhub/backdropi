import { useEditor } from '@/context/EditorContext'
import { Monitor, Image } from 'lucide-react'
import type { MockupType } from '@/types'

const OPTIONS: { key: MockupType; icon: typeof Monitor; label: string; desc: string }[] = [
  { key: 'screenshot', icon: Image, label: 'Screenshot', desc: 'Plain image on background' },
  { key: 'browser', icon: Monitor, label: 'Browser', desc: 'Safari-style browser chrome' },
]

export function MockupControls() {
  const { state, dispatch } = useEditor()

  return (
    <div className="space-y-3">
      {OPTIONS.map(({ key, icon: Icon, label, desc }) => (
        <button
          key={key}
          onClick={() => dispatch({ type: 'SET_MOCKUP_TYPE', payload: key })}
          className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all duration-150 active:scale-[0.98] ${
            state.mockupType === key
              ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
              : 'border-border hover:border-primary/50 hover:bg-accent'
          }`}
        >
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${
            state.mockupType === key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-foreground">{label}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
