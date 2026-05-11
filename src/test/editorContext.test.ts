import { describe, it, expect } from 'vitest'
import { editorReducer } from '@/context/EditorContext'
import { DEFAULT_STATE } from '@/lib/constants'

describe('editorReducer', () => {
  it('returns default state initially', () => {
    const state = editorReducer(DEFAULT_STATE, { type: 'RESET' })
    expect(state).toEqual(DEFAULT_STATE)
  })

  it('handles SET_SOURCE_IMAGE', () => {
    const imageData = new ImageData(100, 100)
    const action = {
      type: 'SET_SOURCE_IMAGE' as const,
      payload: { imageData, src: 'data:image/png;base64,abc', width: 100, height: 100 },
    }
    const state = editorReducer(DEFAULT_STATE, action)
    expect(state.sourceImage).toBe(imageData)
    expect(state.sourceImageSrc).toBe('data:image/png;base64,abc')
    expect(state.canvasSize).toEqual({ width: 100 + DEFAULT_STATE.padding * 2, height: 100 + DEFAULT_STATE.padding * 2 })
  })

  it('handles CLEAR_SOURCE_IMAGE', () => {
    const loaded = editorReducer(DEFAULT_STATE, {
      type: 'SET_SOURCE_IMAGE',
      payload: { imageData: new ImageData(50, 50), src: 'x', width: 50, height: 50 },
    })
    const cleared = editorReducer(loaded, { type: 'CLEAR_SOURCE_IMAGE' })
    expect(cleared.sourceImage).toBeNull()
    expect(cleared.sourceImageSrc).toBeNull()
    expect(cleared.canvasSize).toBeNull()
  })

  it('handles SET_BACKGROUND', () => {
    const bg = { type: 'solid' as const, color: '#ff0000' }
    const state = editorReducer(DEFAULT_STATE, { type: 'SET_BACKGROUND', payload: bg })
    expect(state.background).toEqual(bg)
  })

  it('handles SET_SHADOW merging partial', () => {
    const state = editorReducer(DEFAULT_STATE, { type: 'SET_SHADOW', payload: { blur: 50, enabled: false } })
    expect(state.shadow.blur).toBe(50)
    expect(state.shadow.enabled).toBe(false)
    expect(state.shadow.offsetX).toBe(DEFAULT_STATE.shadow.offsetX)
    expect(state.shadow.offsetY).toBe(DEFAULT_STATE.shadow.offsetY)
    expect(state.shadow.color).toBe(DEFAULT_STATE.shadow.color)
  })

  it('handles SET_CORNER_RADIUS', () => {
    const state = editorReducer(DEFAULT_STATE, { type: 'SET_CORNER_RADIUS', payload: 24 })
    expect(state.cornerRadius).toBe(24)
  })

  it('handles SET_PADDING and recalculates canvasSize', () => {
    const withImage = editorReducer(DEFAULT_STATE, {
      type: 'SET_SOURCE_IMAGE',
      payload: { imageData: new ImageData(200, 100), src: 'x', width: 200, height: 100 },
    })
    const state = editorReducer(withImage, { type: 'SET_PADDING', payload: 100 })
    expect(state.padding).toBe(100)
    expect(state.canvasSize).toEqual({ width: 200 + 200, height: 100 + 200 })
  })

  it('handles SET_EXPORT_FORMAT', () => {
    const state = editorReducer(DEFAULT_STATE, { type: 'SET_EXPORT_FORMAT', payload: 'jpeg' })
    expect(state.exportFormat).toBe('jpeg')
  })

  it('handles SET_EXPORT_QUALITY', () => {
    const state = editorReducer(DEFAULT_STATE, { type: 'SET_EXPORT_QUALITY', payload: 0.5 })
    expect(state.exportQuality).toBe(0.5)
  })

  it('handles RESET', () => {
    const modified = editorReducer(DEFAULT_STATE, { type: 'SET_CORNER_RADIUS', payload: 99 })
    const reset = editorReducer(modified, { type: 'RESET' })
    expect(reset).toEqual(DEFAULT_STATE)
  })
})
