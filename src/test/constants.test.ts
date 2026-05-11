import { describe, it, expect } from 'vitest'
import { DEFAULT_STATE, DEFAULT_BACKGROUND, DEFAULT_SHADOW, IMAGE_MIME_TYPES, EXPORT_MIME_TYPES, UPLOAD_MAX_SIZE } from '@/lib/constants'

describe('DEFAULT_STATE', () => {
  it('has no source image initially', () => {
    expect(DEFAULT_STATE.sourceImage).toBeNull()
    expect(DEFAULT_STATE.sourceImageSrc).toBeNull()
    expect(DEFAULT_STATE.canvasSize).toBeNull()
  })

  it('defaults to gradient background', () => {
    expect(DEFAULT_STATE.background).toEqual(DEFAULT_BACKGROUND)
    expect(DEFAULT_STATE.background.type).toBe('gradient')
  })

  it('has a gradient with two colors and direction', () => {
    if (DEFAULT_BACKGROUND.type === 'gradient') {
      expect(DEFAULT_BACKGROUND.colors).toHaveLength(2)
      expect(typeof DEFAULT_BACKGROUND.direction).toBe('number')
    }
  })

  it('has shadow enabled with sensible defaults', () => {
    expect(DEFAULT_STATE.shadow).toEqual(DEFAULT_SHADOW)
    expect(DEFAULT_SHADOW.enabled).toBe(true)
    expect(DEFAULT_SHADOW.blur).toBeGreaterThan(0)
  })

  it('has non-zero corner radius and padding', () => {
    expect(DEFAULT_STATE.cornerRadius).toBeGreaterThan(0)
    expect(DEFAULT_STATE.padding).toBeGreaterThan(0)
  })

  it('defaults to PNG export at standard quality', () => {
    expect(DEFAULT_STATE.exportFormat).toBe('png')
    expect(DEFAULT_STATE.exportQuality).toBeGreaterThan(0.5)
    expect(DEFAULT_STATE.exportQuality).toBeLessThanOrEqual(1)
  })
})

describe('IMAGE_MIME_TYPES', () => {
  it('includes common image formats', () => {
    expect(IMAGE_MIME_TYPES).toContain('image/png')
    expect(IMAGE_MIME_TYPES).toContain('image/jpeg')
    expect(IMAGE_MIME_TYPES).toContain('image/webp')
  })

  it('does not include non-image types', () => {
    expect(IMAGE_MIME_TYPES).not.toContain('image/svg+xml')
  })
})

describe('EXPORT_MIME_TYPES', () => {
  it('maps format names to mime types', () => {
    expect(EXPORT_MIME_TYPES.png).toBe('image/png')
    expect(EXPORT_MIME_TYPES.jpeg).toBe('image/jpeg')
  })
})

describe('UPLOAD_MAX_SIZE', () => {
  it('is 20 MB', () => {
    expect(UPLOAD_MAX_SIZE).toBe(20 * 1024 * 1024)
  })
})
