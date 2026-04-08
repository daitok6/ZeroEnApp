import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh bg-[var(--surface)]">
      {/* Header */}
      <header className="bg-[var(--background)] border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-semibold">
            {process.env.NEXT_PUBLIC_APP_NAME ?? "App"}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--muted)]">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            Welcome back, {user.email}
          </p>
        </div>

        {/* Stats grid — replace with real data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Stat One", value: "—" },
            { label: "Stat Two", value: "—" },
            { label: "Stat Three", value: "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6"
            >
              <p className="text-sm text-[var(--muted)] mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main content area — replace with your app's content */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-8">
          <h2 className="text-lg font-semibold mb-4">Main Content</h2>
          <p className="text-[var(--muted)] text-sm">
            Replace this with your app&apos;s core functionality.
          </p>
        </div>
      </main>
    </div>
  );
}
