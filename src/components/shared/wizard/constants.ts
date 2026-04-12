export const VIBE_TAGS = [
  'Modern', 'Classic', 'Warm', 'Clean', 'Technical', 'Friendly',
  'Premium', 'Bold', 'Elegant', 'Energetic', 'Trustworthy', 'Creative',
];

export const PRESET_PALETTES = [
  { id: 'dark-tech',    name: 'Dark Tech',    bg: '#0D0D0D', accent: '#00E87A', text: '#F4F4F2' },
  { id: 'clean-light',  name: 'Clean Light',  bg: '#FFFFFF', accent: '#1A1A2E', text: '#333333' },
  { id: 'warm-earth',   name: 'Warm Earth',   bg: '#F5F0E8', accent: '#8B4513', text: '#2C1810' },
  { id: 'ocean-blue',   name: 'Ocean Blue',   bg: '#0A1628', accent: '#0EA5E9', text: '#E2F4FF' },
];

export const FONT_PAIRINGS = [
  { id: 'modern-mono', name: 'Modern Mono', description: 'IBM Plex Mono + Syne' },
  { id: 'clean-sans',  name: 'Clean Sans',  description: 'Inter + Plus Jakarta Sans' },
  { id: 'bold-serif',  name: 'Bold Serif',  description: 'Playfair Display + DM Sans' },
];

export const inputClass =
  'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280]';

export const labelClass =
  'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2 font-mono';

export const t = (locale: string, en: string, ja: string) =>
  locale === 'ja' ? ja : en;
