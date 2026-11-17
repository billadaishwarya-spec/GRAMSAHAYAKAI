// src/app/complaints/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import {
  submitComplaint,
  subscribeToComplaints,
  type Complaint,
} from "@/firebase/firestore";

type FormData = { category: string; description: string; location: string };

const STATUS_STYLES: Record<Complaint["status"], string> = {
  submitted: "bg-clay-100 text-clay-600",
  in_review: "bg-amber-100 text-amber-700",
  resolved: "bg-leaf-100 text-leaf-600",
};

const STATUS_LABELS: Record<Complaint["status"], string> = {
  submitted: "Submitted",
  in_review: "In review",
  resolved: "Resolved",
};

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    if (!user) return;
    return subscribeToComplaints(user.uid, setComplaints);
  }, [user]);

  async function onSubmit(data: FormData) {
    if (!user) return;
    setSubmitting(true);
    try {
      await submitComplaint({ uid: user.uid, ...data });
      reset();
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-ink/70">
          Please <a href="/login" className="text-leaf-600 underline">sign in</a> to file or track complaints.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-clay-50 px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-ink">Complaints</h1>
        <p className="mt-1 text-sm text-ink/60">
          Register a new complaint or check the status of one you've already filed.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-4 rounded-2xl border border-clay-200 bg-white p-6"
        >
          <h2 className="font-medium text-ink">File a new complaint</h2>
          <div>
            <label className="text-sm text-ink/70">Category</label>
            <select
              {...register("category", { required: true })}
              className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-leaf-400"
            >
              <option value="water">Water supply</option>
              <option value="electricity">Electricity</option>
              <option value="roads">Roads & infrastructure</option>
              <option value="agriculture">Agriculture support</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-ink/70">Description</label>
            <textarea
              {...register("description", { required: true })}
              rows={3}
              className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-leaf-400"
            />
          </div>
          <div>
            <label className="text-sm text-ink/70">Village / location</label>
            <input
              {...register("location")}
              className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-leaf-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-leaf-500 px-6 py-2.5 font-medium text-white hover:bg-leaf-600 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit complaint"}
          </button>
        </form>

        <div className="mt-10">
          <h2 className="font-medium text-ink">Your complaints</h2>
          {complaints.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">No complaints filed yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {complaints.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-clay-200 bg-white p-4"
                >
                  <div>
                    <p className="font-medium capitalize text-ink">{c.category}</p>
                    <p className="mt-1 text-sm text-ink/60">{c.description}</p>
                    {c.location && <p className="mt-1 text-xs text-ink/40">{c.location}</p>}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[c.status]}`}
                  >
                    {STATUS_LABELS[c.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
