export interface SolidBackground {
  type: 'solid'
  color: string
}

export interface GradientBackground {
  type: 'gradient'
  colors: [string, string]
  direction: number
}

export interface ImageBackground {
  type: 'image'
  src: string
  fit: 'cover' | 'contain' | 'fill'
}

export interface UnsplashBackground {
  type: 'unsplash'
  photoId: string
  urls: { regular: string; small: string }
  authorName: string
  authorLink: string
}

export type Background = SolidBackground | GradientBackground | ImageBackground | UnsplashBackground

export interface ShadowConfig {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  enabled: boolean
}

export type MockupType = 'screenshot' | 'browser' | 'laptop' | 'desktop'

export interface EditorState {
  sourceImage: ImageData | null
  sourceImageSrc: string | null
  background: Background
  shadow: ShadowConfig
  cornerRadius: number
  padding: number
  mockupType: MockupType
  exportFormat: 'png' | 'jpeg'
  exportQuality: number
  canvasSize: { width: number; height: number } | null
  _past: EditorState[]
  _future: EditorState[]
}

export type EditorAction =
  | { type: 'SET_SOURCE_IMAGE'; payload: { imageData: ImageData; src: string; width: number; height: number } }
  | { type: 'CLEAR_SOURCE_IMAGE' }
  | { type: 'SET_BACKGROUND'; payload: Background }
  | { type: 'SET_SHADOW'; payload: Partial<ShadowConfig> }
  | { type: 'SET_CORNER_RADIUS'; payload: number }
  | { type: 'SET_PADDING'; payload: number }
  | { type: 'SET_MOCKUP_TYPE'; payload: MockupType }
  | { type: 'SET_EXPORT_FORMAT'; payload: 'png' | 'jpeg' }
  | { type: 'SET_EXPORT_QUALITY'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }

export interface UnsplashPhoto {
  id: string
  urls: { regular: string; small: string }
  alt_description: string | null
  user: { name: string; links: { html: string } }
}
