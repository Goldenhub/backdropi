# backdropi — Agent Guide

## Overview
Browser-based screenshot → polished mockup editor. Built with Vite + React 19 + TypeScript 5 + Tailwind CSS v4.

## Project Structure
```
src/
├── types/index.ts          # All shared types
├── lib/
│   ├── constants.ts        # Defaults, limits, mime types
│   ├── canvas.ts           # Pure canvas rendering — no React
│   └── export.ts           # Blob download utility
├── context/
│   └── EditorContext.tsx    # Central state (useReducer)
├── hooks/
│   ├── useImageUpload.ts    # File → ImageData pipeline
│   ├── useCanvasRenderer.ts # Canvas redraw on state change
│   ├── useUnsplashSearch.ts # Debounced Unsplash API
│   └── useExport.ts         # HiDPI export
├── components/
│   ├── ui/                  # Primitives: Button, Slider, ColorPicker
│   ├── upload/              # DropZone (click, dnd, paste)
│   ├── controls/            # Feature panels
│   └── editor/              # Canvas + Toolbar
└── App.tsx                  # Layout: Toolbar | Sidebar + Canvas
```

## Conventions
- **Types** in `types/index.ts` — `EditorState` is the single source of truth. New features add a field here.
- **Canvas rendering** is a pure function in `lib/canvas.ts` — takes state, draws to context. No React refs.
- **Controls** are independent components receiving state via `useEditor()`. Add a new one by dropping a file in `controls/`.
- **Hooks** follow `use<Feature>` naming. One concern per hook.
- **UI primitives** in `ui/` — no logic, just presentation.
- State management is `useReducer` + Context. Swap for Zustand later if needed — same shape.
- **Icons**: use `lucide-react`. Import only the icons needed.
- **Styling**: shadcn-style light theme. Use CSS variables: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-secondary`, `border-border`, etc.
- **Animations**: use `transition-all duration-150` on interactive elements, `active:scale-[0.97]` on buttons.

## Environment
- `VITE_UNSPLASH_ACCESS_KEY` — required for Unsplash search

## Commands
- `npm run dev` — start dev server
- `npm run build` — typecheck + production build
- `npm run lint` — ESLint

## Adding a Feature
1. Define types in `types/index.ts` (extend `EditorState`, add union variants)
2. Add reducer cases in `EditorContext.tsx`
3. Create control component in `controls/`
4. (Optional) Create a hook in `hooks/`
5. Import and mount in `App.tsx` Sidebar
