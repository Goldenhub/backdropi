import { EditorProvider } from '@/context/EditorContext'
import { Toolbar } from '@/components/editor/Toolbar'
import { Canvas } from '@/components/editor/Canvas'
import { DropZone } from '@/components/upload/DropZone'
import { ToolPalette } from '@/components/editor/ToolPalette'
import { ToolPanel } from '@/components/editor/ToolPanel'
import { useEditor } from '@/context/EditorContext'
import { useState } from 'react'
import type { ToolId } from '@/components/editor/ToolPalette'

function Workspace() {
  const { state } = useEditor()
  const [activeTool, setActiveTool] = useState<ToolId | null>(null)

  if (!state.sourceImage) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-md px-8">
          <DropZone />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 min-h-0 relative">
      <div className="flex items-start gap-3 p-4 absolute left-0 top-0 bottom-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <ToolPalette activeTool={activeTool} onSelect={setActiveTool} />
        </div>
        {activeTool && (
          <div className="pointer-events-auto">
            <ToolPanel tool={activeTool} onClose={() => setActiveTool(null)} />
          </div>
        )}
      </div>
      <Canvas />
    </div>
  )
}

function App() {
  return (
    <EditorProvider>
      <div className="h-screen w-screen flex flex-col bg-muted text-foreground overflow-hidden relative">
        <Toolbar />
        <Workspace />
      </div>
    </EditorProvider>
  )
}

export default App
