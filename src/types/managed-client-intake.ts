export type BrandKit = {
  tone: { playful: number; minimal: number; corporate: number };
  vibe_tags: string[];
  palette: { preset: string | null; colors: { bg: string; accent: string; text: string } };
  font_pairing: string;
  sample_sites: string[];
};

export type AssetsData = {
  logo_url: string | null;
  copy: string;
  tagline: string | null;
  extra_image_urls: string[];
};

export type DomainData = {
  type: 'own' | 'help';
  value: string;
};

export interface ManagedClientIntakeRow {
  profile_id: string;
  plan_tier: string | null;
  scope_ack: boolean;
  commitment_ack_at: string | null;
  coconala_order_ref: string | null;
  brand_kit: BrandKit | null;
  assets: AssetsData | null;
  domain: DomainData | null;
  updated_at: string | null;
}
