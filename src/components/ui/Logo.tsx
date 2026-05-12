export function Logo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e8b4c4" />
          <stop offset="100%" stop-color="#d098a8" />
        </linearGradient>
        <linearGradient id="fg-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d0b0dc" />
          <stop offset="100%" stop-color="#b088c0" />
        </linearGradient>
        <filter id="shadow-logo" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#7a6088" flood-opacity="0.35" />
        </filter>
      </defs>
      <rect x="1" y="6" width="27" height="27" rx="7" fill="url(#bg-logo)" />
      <rect x="6" y="2" width="22" height="22" rx="5.5" fill="url(#fg-logo)" filter="url(#shadow-logo)" />
    </svg>
  )
}

export function Logomark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e8b4c4" />
          <stop offset="100%" stop-color="#d098a8" />
        </linearGradient>
        <linearGradient id="fg-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d0b0dc" />
          <stop offset="100%" stop-color="#b088c0" />
        </linearGradient>
        <filter id="shadow-mark" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#7a6088" flood-opacity="0.35" />
        </filter>
      </defs>
      <rect x="1" y="6" width="27" height="27" rx="7" fill="url(#bg-mark)" />
      <rect x="6" y="2" width="22" height="22" rx="5.5" fill="url(#fg-mark)" filter="url(#shadow-mark)" />
    </svg>
  )
}

export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e8b4c4"/><stop offset="100%" stop-color="#d098a8"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d0b0dc"/><stop offset="100%" stop-color="#b088c0"/></linearGradient><filter id="c"><feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#7a6088" flood-opacity="0.35"/></filter></defs><rect x="1" y="6" width="27" height="27" rx="7" fill="url(#a)"/><rect x="6" y="2" width="22" height="22" rx="5.5" fill="url(#b)" filter="url(#c)"/></svg>`
