import { useEditor } from '@/context/EditorContext'
import { useUnsplashSearch } from '@/hooks/useUnsplashSearch'
import { Image, Search, Loader2, AlertCircle, ExternalLink } from 'lucide-react'

export function UnsplashPicker() {
  const { state, dispatch } = useEditor()
  const { query, setQuery, photos, loading, error } = useUnsplashSearch()
  const isActive = state.background.type === 'unsplash'

  const activateUnsplash = () => {
    if (!isActive) {
      dispatch({ type: 'SET_BACKGROUND', payload: { type: 'unsplash', photoId: '', urls: { regular: '', small: '' }, authorName: '', authorLink: '' } })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unsplash</h3>
        </div>
        {!isActive && (
          <button
            onClick={activateUnsplash}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Use photo
          </button>
        )}
      </div>

      {isActive && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search photos..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary border border-border rounded-lg placeholder-muted-foreground text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-shadow"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          )}

          {!loading && query && photos.length === 0 && !error && (
            <p className="text-xs text-muted-foreground text-center py-4">No results found</p>
          )}

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => dispatch({ type: 'SET_BACKGROUND', payload: { type: 'unsplash', photoId: photo.id, urls: photo.urls, authorName: photo.user.name, authorLink: photo.user.links.html } })}
                className={`relative group rounded-lg overflow-hidden aspect-[4/3] border transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-ring ${
                  state.background.type === 'unsplash' && state.background.photoId === photo.id
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <img src={photo.urls.small} alt={photo.alt_description ?? ''} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>

          {state.background.type === 'unsplash' && state.background.authorName && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Photo by</span>
              <a
                href={state.background.authorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 text-primary hover:text-primary/80 transition-colors"
              >
                {state.background.authorName}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>on Unsplash</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
