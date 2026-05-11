import { createContext, useContext, useReducer, useEffect, useCallback, useRef, useState, type ReactNode } from 'react'
import type { EditorState, EditorAction } from '@/types'
import { DEFAULT_STATE } from '@/lib/constants'

const STORAGE_KEY = 'backdropi-state'
const SAVE_DEBOUNCE_MS = 300

interface PersistedState {
  sourceImageSrc: string | null
  background: EditorState['background']
  shadow: EditorState['shadow']
  cornerRadius: number
  padding: number
  mockupType: EditorState['mockupType']
  exportFormat: EditorState['exportFormat']
  exportQuality: number
  canvasSize: EditorState['canvasSize']
}

function loadSavedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

async function reconstructImageData(src: string): Promise<{ imageData: ImageData; width: number; height: number } | null> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    return { imageData, width: canvas.width, height: canvas.height }
  } catch {
    return null
  }
}

function stripHistory(s: EditorState): EditorState {
  return { ...s, _past: [], _future: [] }
}

const UNDOABLE_ACTIONS: readonly EditorAction['type'][] = [
  'SET_BACKGROUND', 'SET_SHADOW', 'SET_CORNER_RADIUS', 'SET_PADDING', 'SET_MOCKUP_TYPE',
]

function reduce(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'UNDO': {
      if (state._past.length === 0) return state
      const prev = state._past[state._past.length - 1]
      return {
        ...prev,
        _past: state._past.slice(0, -1),
        _future: [stripHistory(state), ...state._future],
      }
    }
    case 'REDO': {
      if (state._future.length === 0) return state
      const next = state._future[0]
      return {
        ...next,
        _past: [...state._past, stripHistory(state)],
        _future: state._future.slice(1),
      }
    }
    case 'SET_SOURCE_IMAGE':
      return {
        ...state,
        sourceImage: action.payload.imageData,
        sourceImageSrc: action.payload.src,
        canvasSize: { width: action.payload.width + state.padding * 2, height: action.payload.height + state.padding * 2 },
      }
    case 'CLEAR_SOURCE_IMAGE':
      return { ...state, sourceImage: null, sourceImageSrc: null, canvasSize: null }
    case 'SET_BACKGROUND':
      return { ...state, background: action.payload }
    case 'SET_SHADOW':
      return { ...state, shadow: { ...state.shadow, ...action.payload } }
    case 'SET_CORNER_RADIUS':
      return { ...state, cornerRadius: action.payload }
    case 'SET_PADDING':
      return {
        ...state,
        padding: action.payload,
        canvasSize: state.sourceImage
          ? { width: state.sourceImage.width + action.payload * 2, height: state.sourceImage.height + action.payload * 2 }
          : null,
      }
    case 'SET_MOCKUP_TYPE':
      return action.payload === 'browser'
        ? { ...state, mockupType: action.payload, cornerRadius: 0 }
        : { ...state, mockupType: action.payload }
    case 'SET_EXPORT_FORMAT':
      return { ...state, exportFormat: action.payload }
    case 'SET_EXPORT_QUALITY':
      return { ...state, exportQuality: action.payload }
    case 'RESET':
      return DEFAULT_STATE
    default:
      return state
  }
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  const newState = reduce(state, action)
  if (newState === state) return state

  if (action.type === 'UNDO' || action.type === 'REDO') return newState

  if (UNDOABLE_ACTIONS.includes(action.type)) {
    return {
      ...newState,
      _past: [...state._past, stripHistory(state)],
      _future: [],
    }
  }
  return newState
}

interface EditorContextValue {
  state: EditorState
  dispatch: React.Dispatch<EditorAction>
  canUndo: boolean
  canRedo: boolean
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  const saved = useRef(loadSavedState()).current
  const base = saved
    ? {
        ...DEFAULT_STATE,
        sourceImage: null,
        sourceImageSrc: saved.sourceImageSrc ?? null,
        background: saved.background,
        shadow: saved.shadow,
        cornerRadius: saved.cornerRadius,
        padding: saved.padding,
        mockupType: saved.mockupType,
        exportFormat: saved.exportFormat,
        exportQuality: saved.exportQuality,
        canvasSize: saved.canvasSize,
      }
    : DEFAULT_STATE

  const [state, dispatch] = useReducer(editorReducer, base)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!ready) {
      setReady(true)
      if (saved?.sourceImageSrc && !state.sourceImage) {
        reconstructImageData(saved.sourceImageSrc).then((result) => {
          if (result) {
            dispatch({
              type: 'SET_SOURCE_IMAGE',
              payload: { imageData: result.imageData, src: saved.sourceImageSrc!, width: result.width, height: result.height },
            })
          }
        })
      }
    }
  }, [ready, saved, state.sourceImage])

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const data: PersistedState = {
        sourceImageSrc: state.sourceImageSrc,
        background: state.background,
        shadow: state.shadow,
        cornerRadius: state.cornerRadius,
        padding: state.padding,
        mockupType: state.mockupType,
        exportFormat: state.exportFormat,
        exportQuality: state.exportQuality,
        canvasSize: state.canvasSize,
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, sourceImageSrc: null }))
        } catch {}
      }
    }, SAVE_DEBOUNCE_MS)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [state])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey
    if (mod && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      dispatch({ type: 'UNDO' })
    }
    if (mod && e.key === 'z' && e.shiftKey) {
      e.preventDefault()
      dispatch({ type: 'REDO' })
    }
    if (mod && e.key === 'y') {
      e.preventDefault()
      dispatch({ type: 'REDO' })
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <EditorContext.Provider value={{ state, dispatch, canUndo: state._past.length > 0, canRedo: state._future.length > 0 }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('useEditor must be used within EditorProvider')
  return ctx
}
