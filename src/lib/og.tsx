/**
 * Shared helpers for opengraph-image.tsx routes.
 * Edge-runtime compatible: no Node-only APIs.
 */

export const OG_SIZE = {width: 1200, height: 630} as const;
export const OG_CONTENT_TYPE = 'image/png' as const;

const BRAND_YELLOW = '#FACC15';
const BRAND_BLACK = '#0f0f0f';

/**
 * Locale-aware short labels used across OG cards.
 * Hardcoded here to avoid loading next-intl message dictionaries in Edge runtime.
 */
export const OG_LABELS = {
  tr: {
    siteName: 'SAMİMİ SPOR KULÜBÜ',
    blog: 'BLOG',
    branch: 'BRANŞ',
    trainer: 'EĞİTMEN'
  },
  en: {
    siteName: 'SAMİMİ SPORTS CLUB',
    blog: 'BLOG',
    branch: 'CLASS',
    trainer: 'TRAINER'
  }
} as const;

export function ogLabels(locale: string) {
  return OG_LABELS[locale === 'en' ? 'en' : 'tr'];
}

/**
 * Loads a Google Font as TTF for use with `next/og` ImageResponse.
 *
 * Satori (the renderer behind ImageResponse) does not accept WOFF2.
 * Calling /css2 without a User-Agent makes Google Fonts return a TTF URL.
 */
export async function loadGoogleFont(family: string): Promise<ArrayBuffer> {
  const familyParam = family.replace(/ /g, '+');
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyParam}`;
  const css = await fetch(cssUrl).then((r) => r.text());

  const match = css.match(
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/
  );
  if (!match) throw new Error(`Could not parse TTF URL for ${family}`);
  const res = await fetch(match[1]);
  if (!res.ok) {
    throw new Error(`Failed to fetch TTF for ${family}: ${res.status}`);
  }
  return res.arrayBuffer();
}

/**
 * Renders the shared OG layout. Returns a JSX tree intended for `new ImageResponse(...)`.
 *
 * `kicker` is shown at the top in small uppercase letters.
 * `title` is the big focal text.
 * `meta` is the bottom-left small text (category, schedule etc.).
 */
export function OgCard({
  kicker,
  title,
  meta,
  emoji
}: {
  kicker: string;
  title: string;
  meta?: string;
  emoji?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: BRAND_YELLOW,
        padding: '72px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'BebasNeue',
        color: BRAND_BLACK
      }}
    >
      {/* TOP */}
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div
          style={{
            width: 8,
            height: 56,
            background: BRAND_BLACK,
            borderRadius: 4
          }}
        />
        <div style={{fontSize: 32, letterSpacing: 6}}>{kicker}</div>
      </div>

      {/* CENTER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          flex: 1,
          paddingTop: 40,
          paddingBottom: 40
        }}
      >
        {emoji && (
          <div style={{fontSize: 160, lineHeight: 1}}>{emoji}</div>
        )}
        <div
          style={{
            fontSize: title.length > 40 ? 88 : 120,
            lineHeight: 0.95,
            letterSpacing: 2,
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          {title}
        </div>
      </div>

      {/* BOTTOM */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: 28,
          letterSpacing: 2
        }}
      >
        <div style={{opacity: 0.75}}>{meta ?? ''}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              background: BRAND_BLACK
            }}
          />
          <div>SAMİMİSPORKULUBU.COM</div>
        </div>
      </div>
    </div>
  );
}
