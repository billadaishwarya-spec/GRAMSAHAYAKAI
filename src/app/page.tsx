// src/app/page.tsx
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-xl font-semibold text-leaf-600">
          GramSahayak <span className="text-clay-500">AI</span>
        </span>
        <LanguageSwitcher />
      </header>

      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-body text-sm uppercase tracking-widest text-leaf-600">
            ಸ್ಮಾರ್ಟ್ ಗ್ರಾಮ ಸಹಾಯ &middot; ग्राम सहायता &middot; village assistance
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
            Government help,<br />in your own language.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
            Ask about scheme eligibility, get crop advisory, and track complaints —
            by typing or speaking in English, Hindi, or Kannada.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/chat"
              className="rounded-full bg-leaf-500 px-8 py-3 font-medium text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-leaf-600"
            >
              Start a conversation
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-clay-300 px-8 py-3 font-medium text-ink transition-colors hover:bg-clay-100"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 px-6 pb-24 md:grid-cols-3 md:px-12">
        {[
          {
            title: "Scheme eligibility",
            desc: "Ask in plain words and find out which government schemes you qualify for, with document checklists.",
          },
          {
            title: "Crop advisory",
            desc: "Get guidance on crop care, timing, and common issues, in the language you're comfortable with.",
          },
          {
            title: "Complaint tracking",
            desc: "File a complaint by voice or text and follow its status from submission to resolution.",
          },
        ].map((card) => (
          <div key={card.title} className="rounded-2xl border border-clay-200 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-leaf-600">{card.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{card.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
