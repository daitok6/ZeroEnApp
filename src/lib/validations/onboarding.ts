import { z } from 'zod';

export const step1Schema = z.object({
  app_name: z.string().min(2, 'App name is required'),
  app_description: z.string().min(20, 'Please describe your app in more detail (min 20 chars)'),
  target_launch_date: z.string().optional(),
  preferred_locale: z.enum(['en', 'ja']).default('en'),
});

export const step2Schema = z.object({
  auth_method: z.enum(['email-password', 'google', 'both', 'other'], {
    error: 'Please select an authentication method',
  }),
  key_features: z.string().min(10, 'Please describe the key features (min 10 chars)'),
  integrations: z.string().optional(),
  design_references: z.string().optional(),
});

export const step3Schema = z.object({
  entity_name: z.string().optional(),
  signature_name: z.string().min(2, 'Please type your full name to sign'),
  terms_accepted: z.literal(true, {
    error: 'You must accept the terms to continue',
  }),
});

export const step4Schema = z.object({
  timezone: z.string().min(1, 'Please select your timezone'),
  preferred_channel: z.enum(['email', 'slack', 'discord', 'whatsapp'], {
    error: 'Please select a preferred communication channel',
  }),
});

export type OnboardingFormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema> &
  z.infer<typeof step4Schema>;

export const TERMS_VERSION = 'v1.0-2026-04-10';
