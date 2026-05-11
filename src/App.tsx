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
    <div className="flex flex-1 min-h-0">
      <div className="flex flex-col shrink-0 pt-8 pb-4 pl-4">
        <ToolPalette activeTool={activeTool} onSelect={setActiveTool} />
      </div>
      {activeTool && (
        <div className="w-72 shrink-0 pt-8 pb-4 ml-3 overflow-y-auto">
          <div className="h-fit">
            <ToolPanel tool={activeTool} onClose={() => setActiveTool(null)} />
          </div>
        </div>
      )}
      <Canvas />
    </div>
  )
}

function App() {
  return (
    <EditorProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden relative"
        style={{
          background: 'linear-gradient(160deg, #fcf9f6 0%, #f5efe8 40%, #f0edea 100%)',
        }}
      >
        <Toolbar />
        <Workspace />
      </div>
    </EditorProvider>
  )
}

export default App
