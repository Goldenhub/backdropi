import { EXPORT_MIME_TYPES } from './constants'

export function exportCanvas(canvas: HTMLCanvasElement, format: 'png' | 'jpeg', quality: number): void {
  const mime = EXPORT_MIME_TYPES[format]
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backdropi-${Date.now()}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, mime, quality)
}
