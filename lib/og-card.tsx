import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/seo';

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

export type OgCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  tags?: string[];
  footerLeft?: string;
  footerRight?: string;
};

/** Inline SVG mark matching public/logo.svg — next/og cannot load local SVG reliably. */
function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 111"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}>
      <defs>
        <linearGradient
          id="srLogoGrad"
          x1="88.5397"
          y1="95.1555"
          x2="-5.86133"
          y2="-18.8359"
          gradientUnits="userSpaceOnUse">
          <stop offset="0.243965" stopColor={siteConfig.brandColors.slate} />
          <stop offset="0.645117" stopColor={siteConfig.brandColors.coral} />
        </linearGradient>
      </defs>
      <path
        d="M82.7302 39.8431L80.4958 41.1946L69.3933 47.9075L82.7302 63.6829V80.722L56.8318 50.0872L52.6707 45.1653L58.1863 41.8304L72.1501 33.386V28.3441H39.1863V34.515L71.5369 73.8431L74.7468 77.7444L71.1306 81.2728L57.321 94.7503L53.8494 98.139H52.4314L49.2585 94.3401L27.6218 68.4339V51.2737L53.8914 82.7269L59.8318 76.929L29.4392 39.9818L28.1863 38.4593V17.3441H82.7302V39.8431Z"
        fill="url(#srLogoGrad)"
      />
    </svg>
  );
}

function BrandWordmark() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
      <span
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: siteConfig.brandColors.coral,
        }}>
        Sharukh
      </span>
      <LogoMark size={40} />
      <span
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: siteConfig.brandColors.slate,
        }}>
        Rahman
      </span>
    </div>
  );
}

export function createOgImage(props: OgCardProps) {
  const {
    title,
    description,
    eyebrow,
    tags = [],
    footerLeft = siteConfig.author,
    footerRight,
  } = props;

  const host = new URL(siteConfig.url).host;
  const visibleTags = tags.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: siteConfig.brandColors.dark,
          color: '#ffffff',
          position: 'relative',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}>
        {/* Ambient brand glows */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: `radial-gradient(circle, ${siteConfig.brandColors.coral}55 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: -60,
            width: 480,
            height: 480,
            borderRadius: 999,
            background: `radial-gradient(circle, ${siteConfig.brandColors.slate}40 0%, transparent 70%)`,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            margin: 36,
            padding: 44,
            borderRadius: 28,
            border: '1px solid rgba(255,255,255,0.12)',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            position: 'relative',
          }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 36,
            }}>
            <BrandWordmark />
            <span
              style={{
                fontSize: 20,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                letterSpacing: '0.04em',
              }}>
              {host}
            </span>
          </div>

          {eyebrow ? (
            <div
              style={{
                display: 'flex',
                marginBottom: 18,
              }}>
              <span
                style={{
                  fontSize: 16,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: siteConfig.brandColors.coral,
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: `1px solid ${siteConfig.brandColors.coral}55`,
                  background: `${siteConfig.brandColors.coral}18`,
                }}>
                {eyebrow}
              </span>
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              gap: 18,
            }}>
            <div
              style={{
                fontSize: title.length > 72 ? 48 : title.length > 48 ? 56 : 64,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                maxWidth: 980,
                color: '#F8FAFC',
              }}>
              {title}
            </div>

            {description ? (
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: 'rgba(255,255,255,0.68)',
                  maxWidth: 920,
                }}>
                {description.length > 160 ? `${description.slice(0, 157)}…` : description}
              </div>
            ) : null}

            {visibleTags.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginTop: 8,
                }}>
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 18,
                      color: siteConfig.brandColors.slate,
                      padding: '8px 14px',
                      borderRadius: 999,
                      border: '1px solid rgba(172,197,211,0.35)',
                      background: 'rgba(172,197,211,0.1)',
                    }}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 28,
              paddingTop: 22,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${siteConfig.brandColors.slate}, ${siteConfig.brandColors.coral})`,
                  color: siteConfig.brandColors.dark,
                  fontSize: 14,
                  fontWeight: 800,
                }}>
                SR
              </div>
              <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.78)' }}>{footerLeft}</span>
            </div>
            {footerRight ? (
              <span
                style={{
                  fontSize: 18,
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}>
                {footerRight}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
    }
  );
}
