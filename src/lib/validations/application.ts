import { z } from 'zod';

export const step0Schema = z.object({
  nda_accepted: z.literal(true, {
    error: 'You must agree to the confidentiality agreement',
  }),
  nda_signature_name: z.string().min(2, 'Please type your full name to sign'),
});

export const step1Schema = z.object({
  idea_name: z.string().min(2, 'Name is required'),
  idea_description: z.string().min(20, 'Please describe your idea in more detail (min 20 chars)'),
  problem_solved: z.string().min(20, 'Please explain the problem (min 20 chars)'),
});

export const step2Schema = z.object({
  target_users: z.string().min(10, 'Please describe your target users'),
  competitors: z.string().optional(),
  monetization_plan: z.string().min(10, 'Please describe your monetization plan'),
});

export const step3Schema = z.object({
  founder_name: z.string().min(2, 'Name is required'),
  founder_background: z.string().min(20, 'Please tell us about your background'),
  founder_commitment: z.enum(['full-time', 'part-time', 'side-project'], {
    error: 'Please select your time commitment',
  }),
  linkedin_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export type ApplicationFormData = z.infer<typeof step0Schema> &
  z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema>;
