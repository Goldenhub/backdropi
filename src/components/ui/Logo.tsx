export function Logo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="24" height="24" rx="6" fill="#c8a0d8" />
      <rect x="6" y="3" width="22" height="22" rx="5.5" fill="#b894c4" />
    </svg>
  )
}

export function Logomark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="24" height="24" rx="6" fill="#c8a0d8" />
      <rect x="6" y="3" width="22" height="22" rx="5.5" fill="#b894c4" />
    </svg>
  )
}

export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="4" y="5" width="24" height="24" rx="6" fill="#c8a0d8"/><rect x="6" y="3" width="22" height="22" rx="5.5" fill="#b894c4"/></svg>`
