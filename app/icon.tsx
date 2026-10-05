import { ImageResponse } from 'next/og'

// Exported route segment config
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '80px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 256,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            lineHeight: 1,
            letterSpacing: '-8px',
          }}
        >
          GS
        </span>
      </div>
    ),
    {
      ...size,
    },
  )
}
