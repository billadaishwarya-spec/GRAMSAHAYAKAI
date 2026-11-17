// src/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MessageCircle, FileWarning, Sprout, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/firebase/auth";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <main className="flex min-h-screen items-center justify-center">Loading…</main>;
  }

  return (
    <main className="min-h-screen bg-clay-50 px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Welcome{user.displayName ? `, ${user.displayName}` : ""}
            </h1>
            <p className="text-sm text-ink/60">{user.email || user.phoneNumber}</p>
          </div>
          <LanguageSwitcher />
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/chat"
            className="rounded-2xl border border-clay-200 bg-white p-6 transition-colors hover:border-leaf-300"
          >
            <MessageCircle className="text-leaf-500" />
            <p className="mt-3 font-medium text-ink">Chat assistant</p>
            <p className="mt-1 text-sm text-ink/60">Ask about schemes, crops, or anything else.</p>
          </Link>
          <Link
            href="/complaints"
            className="rounded-2xl border border-clay-200 bg-white p-6 transition-colors hover:border-leaf-300"
          >
            <FileWarning className="text-leaf-500" />
            <p className="mt-3 font-medium text-ink">Complaints</p>
            <p className="mt-1 text-sm text-ink/60">File a new complaint or check status.</p>
          </Link>
          <Link
            href="/schemes"
            className="rounded-2xl border border-clay-200 bg-white p-6 transition-colors hover:border-leaf-300"
          >
            <Sprout className="text-leaf-500" />
            <p className="mt-3 font-medium text-ink">Schemes</p>
            <p className="mt-1 text-sm text-ink/60">Browse scheme eligibility and documents.</p>
          </Link>
        </div>

        <button
          onClick={async () => {
            await logOut();
            router.push("/");
          }}
          className="mt-10 flex items-center gap-2 text-sm text-ink/50 hover:text-ink"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </main>
  );
}
