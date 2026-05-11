import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { EditorState, EditorAction } from '@/types'
import { DEFAULT_STATE } from '@/lib/constants'

export function editorReducer(state: EditorState = DEFAULT_STATE, action: EditorAction): EditorState {
  switch (action.type) {
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

interface EditorContextValue {
  state: EditorState
  dispatch: React.Dispatch<EditorAction>
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, DEFAULT_STATE)
  return <EditorContext.Provider value={{ state, dispatch }}>{children}</EditorContext.Provider>
}

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('useEditor must be used within EditorProvider')
  return ctx
}
