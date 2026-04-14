import { z } from 'zod';

// ─── Terms version ────────────────────────────────────────────────────────────
export const TERMS_VERSION = 'v2.0-2026-04-14';

// ─── Step 1 — Business basics ─────────────────────────────────────────────────
export const step1Schema = z.object({
  business_name: z.string().min(2),
  industry: z.string().min(2),
  location: z.string().optional(),
  tagline: z.string().optional(),
  entity_name: z.string().optional(),
  timezone: z.string().min(1),
});

// ─── Step 2 — Brand assets ────────────────────────────────────────────────────
export const step2Schema = z.object({
  logo_url: z.string().url().optional().or(z.literal('')),
  primary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .or(z.literal('')),
  secondary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .or(z.literal('')),
  font_preference: z.string().optional(),
});

// ─── Step 3 — Site goals ──────────────────────────────────────────────────────
export const step3Schema = z.object({
  target_audience: z.string().min(10),
  primary_cta: z.string().min(2),
  key_offerings: z.array(z.string().min(1)).min(1).max(6),
});

// ─── Step 4 — References + Terms ─────────────────────────────────────────────
export const step4Schema = z.object({
  reference_urls: z.array(z.string().url()).max(5).optional().default([]),
  vibe_keywords: z.array(z.string().min(1)).max(10).optional().default([]),
  terms_accepted: z.literal(true, { error: 'You must accept the terms' }),
});

// ─── Combined type ────────────────────────────────────────────────────────────
export type DesignWizardFormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema> &
  z.infer<typeof step4Schema>;
