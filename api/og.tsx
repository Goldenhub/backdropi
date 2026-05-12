import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export default async function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #fcf9f6 0%, #f5efe8 40%, #f0edea 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px' }}>
            <div
              style={{
                position: 'absolute',
                right: '0',
                bottom: '0',
                width: '80px',
                height: '80px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #e8b4c4, #d098a8)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '66px',
                height: '66px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #d0b0dc, #b088c0)',
                boxShadow: '0 3px 6px rgba(122,96,136,0.3)',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: '#1c1a1e',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              backdropi
            </span>
            <span
              style={{
                fontSize: '28px',
                color: '#8b8589',
                fontWeight: 450,
                marginTop: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              Screenshot to Mockup Editor
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
