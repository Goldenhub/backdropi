interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground min-w-10">{label}</span>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        <div
          className="w-8 h-8 rounded-lg border border-border shadow-sm transition-shadow hover:shadow-md"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  )
}
