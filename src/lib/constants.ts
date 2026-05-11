import type { EditorState } from '@/types'

export const DEFAULT_BACKGROUND: EditorState['background'] = {
  type: 'gradient',
  colors: ['#6366f1', '#a855f7'],
  direction: 135,
}

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
  padding: 48,
  exportFormat: 'png',
  exportQuality: 0.92,
  canvasSize: null,
}

export const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp', 'image/avif']
export const EXPORT_MIME_TYPES = { png: 'image/png', jpeg: 'image/jpeg' } as const
export const UPLOAD_MAX_SIZE = 20 * 1024 * 1024
export const PADDING_MAX = 600
