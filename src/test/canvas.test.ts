import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToCanvas } from '@/lib/canvas'
import type { EditorState } from '@/types'
import { DEFAULT_STATE } from '@/lib/constants'

function createMockContext(): CanvasRenderingContext2D {
  const ctx = {
    canvas: { width: 800, height: 600 },
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arcTo: vi.fn(),
    clip: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    drawImage: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    putImageData: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 })),
  } as unknown as CanvasRenderingContext2D
  return ctx
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('renderToCanvas', () => {
  it('clears the canvas before drawing', async () => {
    const ctx = createMockContext()
    const state = { ...DEFAULT_STATE, sourceImage: null }
    await renderToCanvas(ctx, state)
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600)
  })

  it('draws a solid background', async () => {
    const ctx = createMockContext()
    const state = {
      ...DEFAULT_STATE,
      sourceImage: null,
      background: { type: 'solid' as const, color: '#ff0000' },
    }
    await renderToCanvas(ctx, state)
    expect(ctx.fillStyle).toBe('#ff0000')
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600)
  })

  it('draws a gradient background', async () => {
    const ctx = createMockContext()
    ctx.canvas.width = 200
    ctx.canvas.height = 200
    ctx.createLinearGradient = vi.fn(() => ({
      addColorStop: vi.fn(),
    })) as unknown as CanvasRenderingContext2D['createLinearGradient']

    const mockGradient: unknown = { addColorStop: vi.fn() }
    ctx.createLinearGradient = vi.fn(() => mockGradient as CanvasGradient)

    const state = {
      ...DEFAULT_STATE,
      sourceImage: null,
      background: { type: 'gradient' as const, colors: ['#fff', '#000'] as [string, string], direction: 90 },
    }
    await renderToCanvas(ctx, state)
    expect(ctx.createLinearGradient).toHaveBeenCalled()
    expect(ctx.fillStyle).toBe(mockGradient)
  })

  it('resolves when there is no source image', async () => {
    const ctx = createMockContext()
    const state = { ...DEFAULT_STATE, sourceImage: null }
    await expect(renderToCanvas(ctx, state)).resolves.toBeUndefined()
  })

  it('renders shadow when enabled', async () => {
    const ctx = createMockContext()
    const imageData = new ImageData(100, 100)
    const state: EditorState = {
      ...DEFAULT_STATE,
      sourceImage: imageData,
      sourceImageSrc: 'data:image/png;base64,x',
      canvasSize: { width: 800, height: 600 },
      shadow: { offsetX: 5, offsetY: 10, blur: 20, spread: 0, color: '#000', enabled: true },
      cornerRadius: 0,
      padding: 48,
    }
    await renderToCanvas(ctx, state)
    expect(ctx.save).toHaveBeenCalled()
    expect(ctx.restore).toHaveBeenCalled()
  })

  it('skips shadow rendering when disabled', async () => {
    const ctx = createMockContext()
    const imageData = new ImageData(100, 100)
    const state: EditorState = {
      ...DEFAULT_STATE,
      sourceImage: imageData,
      sourceImageSrc: 'data:image/png;base64,x',
      canvasSize: { width: 800, height: 600 },
      shadow: { offsetX: 0, offsetY: 8, blur: 24, spread: 0, color: '#000', enabled: false },
      cornerRadius: 0,
      padding: 48,
    }
    await renderToCanvas(ctx, state)
    expect(ctx.shadowColor).toBeUndefined()
  })
})
