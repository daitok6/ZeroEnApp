// Auth pages (login/signup) use Supabase at render time — must not be statically generated.
export const dynamic = 'force-dynamic';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
