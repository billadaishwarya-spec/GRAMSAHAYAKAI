// src/app/schemes/page.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Scheme = {
  name: string;
  summary: string;
  eligibility: string[];
  documents: string[];
};

// Static seed data — in production this would come from Firestore so it can
// be updated without a redeploy, but a static list is a fine starting point.
const SCHEMES: Scheme[] = [
  {
    name: "PM-KISAN",
    summary: "Income support of ₹6,000/year for landholding farmer families.",
    eligibility: ["Owns cultivable land", "Family is registered as a landholder"],
    documents: ["Aadhaar card", "Land ownership papers", "Bank account details"],
  },
  {
    name: "Ayushman Bharat (PM-JAY)",
    summary: "Health insurance cover up to ₹5 lakh per family per year.",
    eligibility: ["Listed in SECC database as economically vulnerable"],
    documents: ["Aadhaar card", "Ration card", "Family ID"],
  },
  {
    name: "PM Awas Yojana (Gramin)",
    summary: "Financial assistance for building a pucca house.",
    eligibility: ["Houseless or living in a kutcha house", "Rural household"],
    documents: ["Aadhaar card", "Job card (MGNREGA)", "Bank account details"],
  },
];

export default function SchemesPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-clay-50 px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-ink">Government schemes</h1>
        <p className="mt-1 text-sm text-ink/60">
          Tap a scheme to see eligibility and the documents you'll need.
        </p>

        <div className="mt-6 space-y-3">
          {SCHEMES.map((scheme, i) => (
            <div key={scheme.name} className="rounded-xl border border-clay-200 bg-white">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={open === i}
              >
                <div>
                  <p className="font-medium text-ink">{scheme.name}</p>
                  <p className="mt-0.5 text-sm text-ink/60">{scheme.summary}</p>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-ink/40 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="border-t border-clay-100 px-5 py-4 text-sm">
                  <p className="font-medium text-ink/80">Eligibility</p>
                  <ul className="mt-1 list-disc pl-5 text-ink/60">
                    {scheme.eligibility.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                  <p className="mt-3 font-medium text-ink/80">Documents needed</p>
                  <ul className="mt-1 list-disc pl-5 text-ink/60">
                    {scheme.documents.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
