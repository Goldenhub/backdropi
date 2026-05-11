import type { EditorState } from '@/types'

export const DEFAULT_BACKGROUND: EditorState['background'] = {
  type: 'gradient',
  colors: ['#6366f1', '#a855f7'],
  direction: 135,
}

export interface ShadowPreset {
  label: string
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
}

export const SHADOW_PRESETS: ShadowPreset[] = [
  { label: 'Subtle', offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: '#0000001a' },
  { label: 'Soft', offsetX: 0, offsetY: 8, blur: 24, spread: 0, color: '#00000025' },
  { label: 'Deep', offsetX: 0, offsetY: 16, blur: 48, spread: -4, color: '#00000030' },
  { label: 'Dramatic', offsetX: 0, offsetY: 24, blur: 64, spread: -8, color: '#00000040' },
]

export const DEFAULT_SHADOW: EditorState['shadow'] = {
  offsetX: 0,
  offsetY: 8,
  blur: 24,
  spread: 0,
  color: '#00000040',
  enabled: true,
}

export const DEFAULT_STATE: EditorState = {
  sourceImage: null,
  sourceImageSrc: null,
  background: DEFAULT_BACKGROUND,
  shadow: DEFAULT_SHADOW,
  cornerRadius: 12,
  padding: 120,
  mockupType: 'screenshot',
  exportFormat: 'png',
  exportQuality: 0.92,
  canvasSize: null,
  _past: [],
  _future: [],
}

export const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp', 'image/avif']
export const EXPORT_MIME_TYPES = { png: 'image/png', jpeg: 'image/jpeg' } as const
export const UPLOAD_MAX_SIZE = 20 * 1024 * 1024
export const PADDING_MAX = 600
