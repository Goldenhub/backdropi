import { useEditor } from '@/context/EditorContext'

interface ColorSwatchesProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorSwatches({ value, onChange, label }: ColorSwatchesProps) {
  const { state } = useEditor()
  const colors = state.extractedColors

  if (colors.length === 0) return null

  return (
    <div>
      {label && <span className="text-xs font-medium text-muted-foreground block mb-1.5">{label}</span>}
      <div className="flex gap-1.5">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            title={c}
            className={`w-7 h-7 rounded-lg border-2 transition-all duration-150 active:scale-90 ${
              value.toLowerCase() === c.toLowerCase()
                ? 'border-foreground scale-110 shadow-sm'
                : 'border-transparent hover:border-foreground/30'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  )
}
