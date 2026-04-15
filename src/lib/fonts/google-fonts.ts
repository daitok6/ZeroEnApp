// google-fonts.ts
// Curated list of ~70 Google Fonts — all OFL or Apache 2.0, free for commercial use.
// Used in the design wizard font picker. Preview weights loaded lazily via IntersectionObserver.

export type FontCategory = 'sans' | 'serif' | 'mono' | 'display' | 'handwriting';
export type FontScript = 'latin' | 'jp';

export interface FontMeta {
  family: string;
  category: FontCategory;
  script: FontScript;
  /** comma-separated weight list for full load (selected font). Defaults to '400;600;700'. */
  weights?: string;
}

// ── Latin fonts ──────────────────────────────────────────────────────────────

export const LATIN_FONTS: FontMeta[] = [
  // Sans-serif
  { family: 'Inter',              category: 'sans', script: 'latin', weights: '400;600;800' },
  { family: 'Manrope',            category: 'sans', script: 'latin' },
  { family: 'DM Sans',            category: 'sans', script: 'latin' },
  { family: 'Plus Jakarta Sans',  category: 'sans', script: 'latin' },
  { family: 'Space Grotesk',      category: 'sans', script: 'latin' },
  { family: 'Outfit',             category: 'sans', script: 'latin' },
  { family: 'Work Sans',          category: 'sans', script: 'latin' },
  { family: 'Poppins',            category: 'sans', script: 'latin' },
  { family: 'Montserrat',         category: 'sans', script: 'latin', weights: '400;600;800' },
  { family: 'Nunito',             category: 'sans', script: 'latin' },
  { family: 'Nunito Sans',        category: 'sans', script: 'latin' },
  { family: 'Rubik',              category: 'sans', script: 'latin' },
  { family: 'Karla',              category: 'sans', script: 'latin' },
  { family: 'Figtree',            category: 'sans', script: 'latin' },
  { family: 'Open Sans',          category: 'sans', script: 'latin', weights: '400;600;700' },
  { family: 'Lato',               category: 'sans', script: 'latin', weights: '400;700' },
  { family: 'Raleway',            category: 'sans', script: 'latin', weights: '400;600;800' },
  { family: 'Roboto',             category: 'sans', script: 'latin', weights: '400;500;700' },
  { family: 'Sora',               category: 'sans', script: 'latin' },
  { family: 'Mulish',             category: 'sans', script: 'latin' },
  { family: 'Urbanist',           category: 'sans', script: 'latin' },
  { family: 'Be Vietnam Pro',     category: 'sans', script: 'latin' },
  { family: 'Hanken Grotesk',     category: 'sans', script: 'latin' },
  { family: 'Geist',              category: 'sans', script: 'latin' },

  // Serif
  { family: 'Playfair Display',   category: 'serif', script: 'latin', weights: '400;600;700' },
  { family: 'Fraunces',           category: 'serif', script: 'latin' },
  { family: 'Lora',               category: 'serif', script: 'latin', weights: '400;600;700' },
  { family: 'EB Garamond',        category: 'serif', script: 'latin' },
  { family: 'Cormorant Garamond', category: 'serif', script: 'latin', weights: '400;600;700' },
  { family: 'Merriweather',       category: 'serif', script: 'latin', weights: '400;700' },
  { family: 'Source Serif 4',     category: 'serif', script: 'latin', weights: '400;600;700' },
  { family: 'Crimson Pro',        category: 'serif', script: 'latin' },
  { family: 'Bitter',             category: 'serif', script: 'latin', weights: '400;700' },
  { family: 'Libre Baskerville',  category: 'serif', script: 'latin', weights: '400;700' },
  { family: 'Libre Caslon Text',  category: 'serif', script: 'latin' },
  { family: 'Newsreader',         category: 'serif', script: 'latin' },
  { family: 'Spectral',           category: 'serif', script: 'latin', weights: '400;600;700' },
  { family: 'DM Serif Display',   category: 'serif', script: 'latin' },
  { family: 'PT Serif',           category: 'serif', script: 'latin', weights: '400;700' },

  // Monospace
  { family: 'JetBrains Mono',     category: 'mono', script: 'latin', weights: '400;600;800' },
  { family: 'IBM Plex Mono',      category: 'mono', script: 'latin', weights: '400;600;700' },
  { family: 'Space Mono',         category: 'mono', script: 'latin', weights: '400;700' },
  { family: 'Fira Code',          category: 'mono', script: 'latin', weights: '400;600;700' },
  { family: 'Geist Mono',         category: 'mono', script: 'latin' },
  { family: 'Roboto Mono',        category: 'mono', script: 'latin', weights: '400;500;700' },

  // Display & handwriting
  { family: 'Syne',               category: 'display', script: 'latin', weights: '400;700;800' },
  { family: 'Bricolage Grotesque',category: 'display', script: 'latin', weights: '400;600;800' },
  { family: 'Unbounded',          category: 'display', script: 'latin', weights: '400;700;900' },
  { family: 'Abril Fatface',      category: 'display', script: 'latin', weights: '400' },
  { family: 'Archivo Black',      category: 'display', script: 'latin', weights: '400' },
  { family: 'Anton',              category: 'display', script: 'latin', weights: '400' },
  { family: 'Bebas Neue',         category: 'display', script: 'latin', weights: '400' },
  { family: 'Caveat',             category: 'handwriting', script: 'latin', weights: '400;600;700' },
];

// ── Japanese fonts ────────────────────────────────────────────────────────────

export const JP_FONTS: FontMeta[] = [
  { family: 'Noto Sans JP',         category: 'sans',       script: 'jp', weights: '400;700' },
  { family: 'Noto Serif JP',        category: 'serif',      script: 'jp', weights: '400;700' },
  { family: 'M PLUS 1p',            category: 'sans',       script: 'jp', weights: '400;700;800' },
  { family: 'M PLUS Rounded 1c',    category: 'sans',       script: 'jp', weights: '400;700' },
  { family: 'M PLUS 2',             category: 'sans',       script: 'jp', weights: '400;600;700' },
  { family: 'Murecho',              category: 'sans',       script: 'jp', weights: '400;700' },
  { family: 'Zen Kaku Gothic New',  category: 'sans',       script: 'jp', weights: '400;700' },
  { family: 'Zen Maru Gothic',      category: 'sans',       script: 'jp', weights: '400;700' },
  { family: 'Sawarabi Gothic',      category: 'sans',       script: 'jp', weights: '400' },
  { family: 'Kosugi Maru',          category: 'sans',       script: 'jp', weights: '400' },
  { family: 'BIZ UDPGothic',        category: 'sans',       script: 'jp', weights: '400;700' },
  { family: 'Shippori Mincho',      category: 'serif',      script: 'jp', weights: '400;600;700' },
  { family: 'Shippori Mincho B1',   category: 'serif',      script: 'jp', weights: '400;600;700' },
  { family: 'Zen Old Mincho',       category: 'serif',      script: 'jp', weights: '400;700' },
  { family: 'Zen Antique',          category: 'serif',      script: 'jp', weights: '400' },
  { family: 'Sawarabi Mincho',      category: 'serif',      script: 'jp', weights: '400' },
  { family: 'BIZ UDPMincho',        category: 'serif',      script: 'jp', weights: '400;700' },
  { family: 'Klee One',             category: 'handwriting', script: 'jp', weights: '400;600' },
];

// ── Combined list ─────────────────────────────────────────────────────────────

/** All fonts. JP listed first so the ja-locale default ordering puts them at the top. */
export const ALL_FONTS: FontMeta[] = [...JP_FONTS, ...LATIN_FONTS];

/** Category display labels */
export const CATEGORY_LABEL: Record<FontCategory, { en: string; ja: string }> = {
  sans:        { en: 'Sans-serif',   ja: 'サンセリフ' },
  serif:       { en: 'Serif',        ja: 'セリフ' },
  mono:        { en: 'Monospace',    ja: 'モノスペース' },
  display:     { en: 'Display',      ja: 'ディスプレイ' },
  handwriting: { en: 'Handwriting',  ja: '手書き' },
};

/** Script display labels */
export const SCRIPT_LABEL: Record<FontScript, { en: string; ja: string }> = {
  latin: { en: 'Latin', ja: 'ラテン' },
  jp:    { en: 'Japanese', ja: '日本語' },
};

/** Google Fonts CSS2 URL for loading a font at preview size (uses &text= to keep payload small). */
export function previewUrl(family: string, text: string): string {
  const params = new URLSearchParams({
    family: `${family}:wght@400`,
    display: 'swap',
    text,
  });
  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}

/** Google Fonts CSS2 URL for full load of the selected font. */
export function fullUrl(font: FontMeta): string {
  const w = font.weights ?? '400;600;700';
  const family = `${font.family}:wght@${w.replace(/;/g, ';')}`;
  const params = new URLSearchParams({ family, display: 'swap' });
  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}
