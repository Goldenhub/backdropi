import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportCanvas } from '@/lib/export'

beforeEach(() => {
  vi.clearAllMocks()
})

function createMockCanvas(): HTMLCanvasElement {
  const blob = new Blob(['fake'], { type: 'image/png' })
  const toBlob = vi.fn((cb: (b: Blob | null) => void) => cb(blob))
  return { toBlob } as unknown as HTMLCanvasElement
}

describe('exportCanvas', () => {
  it('calls toBlob with the correct mime type for PNG', () => {
    const canvas = createMockCanvas()
    exportCanvas(canvas, 'png', 0.92)
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png', 0.92)
  })

  it('calls toBlob with the correct mime type for JPEG', () => {
    const canvas = createMockCanvas()
    exportCanvas(canvas, 'jpeg', 0.8)
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.8)
  })

  it('creates a download link and clicks it', () => {
    const canvas = createMockCanvas()
    const appendChild = vi.fn()
    const removeChild = vi.fn()
    const click = vi.fn()

    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click,
    } as unknown as HTMLAnchorElement)
    vi.spyOn(document.body, 'appendChild').mockImplementation(appendChild)
    vi.spyOn(document.body, 'removeChild').mockImplementation(removeChild)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    exportCanvas(canvas, 'png', 0.92)

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(appendChild).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(removeChild).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })
})
