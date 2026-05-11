import { EditorProvider } from '@/context/EditorContext'
import { Toolbar } from '@/components/editor/Toolbar'
import { Canvas } from '@/components/editor/Canvas'
import { DropZone } from '@/components/upload/DropZone'
import { BackgroundControls } from '@/components/controls/BackgroundControls'
import { ShadowControls } from '@/components/controls/ShadowControls'
import { CornerControls } from '@/components/controls/CornerControls'
import { UnsplashPicker } from '@/components/controls/UnsplashPicker'
import { useEditor } from '@/context/EditorContext'

function Sidebar() {
  const { state } = useEditor()

  return (
    <aside className="w-80 shrink-0 border-r border-border bg-background overflow-y-auto">
      <div className="p-5 space-y-6">
        {state.sourceImage ? (
          <>
            <BackgroundControls />
            <div className="border-t border-border pt-5">
              <ShadowControls />
            </div>
            <div className="border-t border-border pt-5">
              <CornerControls />
            </div>
            <div className="border-t border-border pt-5">
              <UnsplashPicker />
            </div>
          </>
        ) : (
          <DropZone />
        )}
      </div>
    </aside>
  )
}

function App() {
  return (
    <EditorProvider>
      <div className="h-screen w-screen flex flex-col bg-muted text-foreground overflow-hidden">
        <Toolbar />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <Canvas />
        </div>
      </div>
    </EditorProvider>
  )
}

export default App
