import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'ZeroEn';
  const subtitle = searchParams.get('subtitle') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0D0D0D',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px 0 64px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,232,122,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,122,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Top: wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: '#00E87A',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '18px',
              color: '#0D0D0D',
            }}
          >
            Z
          </div>
          <span
            style={{
              color: '#F4F4F2',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            ZeroEn
          </span>
        </div>

        {/* Middle: title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
          <div
            style={{
              color: '#F4F4F2',
              fontSize: title.length > 40 ? '52px' : '64px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                color: '#9CA3AF',
                fontSize: '28px',
                fontWeight: 400,
                lineHeight: 1.4,
                maxWidth: '800px',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Bottom: green accent line */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #00E87A 0%, rgba(0,232,122,0.2) 60%, transparent 100%)',
            position: 'relative',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
