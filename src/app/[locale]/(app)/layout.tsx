// App shell — no marketing chrome, no intl provider.
// Dashboard and admin have their own layouts that handle auth and navigation.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
