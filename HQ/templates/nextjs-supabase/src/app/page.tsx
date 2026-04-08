import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-dvh flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-lg">
            {process.env.NEXT_PUBLIC_APP_NAME ?? "App"}
          </span>
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-5xl font-bold tracking-tight mb-6"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {/* TODO: Replace with your app's headline */}
            Your compelling headline goes here
          </h1>
          <p
            className="text-xl text-[var(--muted)] mb-10"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {/* TODO: Replace with your app's subheadline */}
            A clear, concise description of what your app does and who it&apos;s for.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get started free
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--surface)] transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Feature One",
                description: "Describe what this feature does and why users love it.",
              },
              {
                title: "Feature Two",
                description: "Describe what this feature does and why users love it.",
              },
              {
                title: "Feature Three",
                description: "Describe what this feature does and why users love it.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background)]"
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-[var(--muted)] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[var(--muted)]">
          <span>{process.env.NEXT_PUBLIC_APP_NAME ?? "App"}</span>
          <span>Built with ZeroEn</span>
        </div>
      </footer>
    </main>
  );
}
