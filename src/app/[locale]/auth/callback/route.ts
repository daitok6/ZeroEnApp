// Re-exports the auth callback handler so /en/auth/callback and /ja/auth/callback
// resolve correctly when Supabase is configured with a locale-prefixed redirect URL.
export { GET } from '@/app/auth/callback/route';
