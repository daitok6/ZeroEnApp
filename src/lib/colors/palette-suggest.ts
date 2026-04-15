// palette-suggest.ts
// Pure HSL-math palette generator — no external dependencies.
// Given a primary hex, produces 5 curated palette suggestions with vibe commentary.

export interface Palette {
  id: string;
  nameEn: string;
  nameJa: string;
  blurbEn: string;
  blurbJa: string;
  primary: string;
  secondary: string;
  accent: string;
  neutralLight: string;
  neutralDark: string;
}

// ── Colour math helpers ──────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  const hn = h / 360, sn = s / 100, ln = l / 100;
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const toC = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const r = Math.round(toC(hn + 1 / 3) * 255);
  const g = Math.round(toC(hn) * 255);
  const b = Math.round(toC(hn - 1 / 3) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function rotateHue(h: number, deg: number): number {
  return ((h + deg) % 360 + 360) % 360;
}

// ── Palette generator ────────────────────────────────────────────────────────

export function suggestPalettes(primaryHex: string): Palette[] {
  // Fallback for invalid / empty hex
  const safeHex = /^#[0-9A-Fa-f]{6}$/.test(primaryHex) ? primaryHex : '#00E87A';
  const [h, s, l] = hexToHsl(safeHex);

  // 1. Mono Pro — primary + near-black bg + warm off-white text
  const monoPrimary = safeHex;
  const monoSecondary = hslToHex(h, Math.min(s, 15), 10);
  const monoAccent = hslToHex(h, Math.min(s + 10, 100), Math.max(l - 10, 30));
  const monoNeutralLight = hslToHex(h, 5, 94);
  const monoNeutralDark = hslToHex(h, 8, 8);

  // 2. Bold Contrast — primary + complementary (180°)
  const boldPrimary = safeHex;
  const boldSecondary = hslToHex(rotateHue(h, 180), Math.min(s, 80), Math.max(l - 5, 20));
  const boldAccent = hslToHex(rotateHue(h, 180), Math.min(s + 10, 100), Math.min(l + 10, 80));
  const boldNeutralLight = '#F8F8F8';
  const boldNeutralDark = '#0F0F0F';

  // 3. Soft Analogous — primary + analogous +30° at lower saturation
  const analogPrimary = safeHex;
  const analogSecondary = hslToHex(rotateHue(h, 30), Math.max(s - 20, 20), Math.min(l + 25, 90));
  const analogAccent = hslToHex(rotateHue(h, -30), Math.max(s - 10, 30), Math.max(l - 10, 30));
  const analogNeutralLight = hslToHex(rotateHue(h, 30), 15, 96);
  const analogNeutralDark = hslToHex(h, 10, 18);

  // 4. Warm Accent — primary + terracotta/amber secondary
  const warmPrimary = safeHex;
  const warmSecondary = hslToHex(28, 70, 52); // warm terracotta
  const warmAccent = hslToHex(42, 90, 55);    // amber
  const warmNeutralLight = '#FAF6F0';
  const warmNeutralDark = '#1C1510';

  // 5. Tech Dark — primary + deep navy + cool light gray
  const techPrimary = safeHex;
  const techSecondary = hslToHex(220, 40, 14); // deep navy
  const techAccent = hslToHex(220, 20, 50);    // muted blue-gray
  const techNeutralLight = '#E8ECF2';
  const techNeutralDark = '#0A0D14';

  return [
    {
      id: 'mono-pro',
      nameEn: 'Mono Pro',
      nameJa: 'モノ・プロ',
      blurbEn: 'Trustworthy, professional. Best for B2B, consultants, and finance.',
      blurbJa: '信頼感とプロ意識。BtoB・士業・コンサル・金融業向け。',
      primary: monoPrimary,
      secondary: monoSecondary,
      accent: monoAccent,
      neutralLight: monoNeutralLight,
      neutralDark: monoNeutralDark,
    },
    {
      id: 'bold-contrast',
      nameEn: 'Bold Contrast',
      nameJa: 'ボールドコントラスト',
      blurbEn: 'Energetic and attention-grabbing. Best for events, launches, and fitness.',
      blurbJa: '元気で目を引く。イベント・新規ローンチ・フィットネス向け。',
      primary: boldPrimary,
      secondary: boldSecondary,
      accent: boldAccent,
      neutralLight: boldNeutralLight,
      neutralDark: boldNeutralDark,
    },
    {
      id: 'soft-analogous',
      nameEn: 'Soft Analogous',
      nameJa: 'ソフトアナロガス',
      blurbEn: 'Calm and friendly. Best for wellness, beauty, and cafés.',
      blurbJa: '穏やかで親しみやすい。ウェルネス・美容・カフェ向け。',
      primary: analogPrimary,
      secondary: analogSecondary,
      accent: analogAccent,
      neutralLight: analogNeutralLight,
      neutralDark: analogNeutralDark,
    },
    {
      id: 'warm-accent',
      nameEn: 'Warm Accent',
      nameJa: 'ウォームアクセント',
      blurbEn: 'Inviting and human. Best for restaurants and local services.',
      blurbJa: '温かみのある人間味。飲食・地域密着サービス向け。',
      primary: warmPrimary,
      secondary: warmSecondary,
      accent: warmAccent,
      neutralLight: warmNeutralLight,
      neutralDark: warmNeutralDark,
    },
    {
      id: 'tech-dark',
      nameEn: 'Tech Dark',
      nameJa: 'テックダーク',
      blurbEn: 'Modern and technical. Best for SaaS, agencies, and dev tools.',
      blurbJa: 'モダンで技術的。SaaS・制作会社・開発ツール向け。',
      primary: techPrimary,
      secondary: techSecondary,
      accent: techAccent,
      neutralLight: techNeutralLight,
      neutralDark: techNeutralDark,
    },
  ];
}
