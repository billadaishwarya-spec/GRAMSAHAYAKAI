// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  setUpRecaptcha,
  sendOtp,
  confirmOtp,
} from "@/firebase/auth";
import type { ConfirmationResult } from "firebase/auth";

type EmailForm = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<EmailForm>();

  async function onEmailSubmit(data: EmailForm) {
    setError(null);
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(data.email, data.password);
      } else {
        await signInWithEmail(data.email, data.password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogleSignIn() {
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  }

  async function onSendOtp() {
    setError(null);
    try {
      const verifier = setUpRecaptcha("recaptcha-container");
      const result = await sendOtp(phone, verifier);
      setConfirmation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send OTP. Check the number.");
    }
  }

  async function onConfirmOtp() {
    if (!confirmation) return;
    setError(null);
    try {
      await confirmOtp(confirmation, otp);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect code. Try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-clay-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-clay-200 bg-white p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-ink/60">Sign in to track schemes and complaints.</p>

        <div className="mt-6 flex rounded-full bg-clay-100 p-1 text-sm">
          <button
            onClick={() => setMode("email")}
            className={`flex-1 rounded-full py-2 ${mode === "email" ? "bg-white shadow-sm" : ""}`}
          >
            Email
          </button>
          <button
            onClick={() => setMode("phone")}
            className={`flex-1 rounded-full py-2 ${mode === "phone" ? "bg-white shadow-sm" : ""}`}
          >
            Phone OTP
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {mode === "email" ? (
          <form onSubmit={handleSubmit(onEmailSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-ink/70">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-leaf-400"
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Password</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-leaf-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-leaf-500 py-2.5 font-medium text-white hover:bg-leaf-600 disabled:opacity-60"
            >
              {submitting ? "Please wait…" : isSignUp ? "Sign up" : "Sign in"}
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            {!confirmation ? (
              <>
                <div>
                  <label className="text-sm text-ink/70">Phone number (+91…)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                    className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-leaf-400"
                  />
                </div>
                <div id="recaptcha-container" />
                <button
                  onClick={onSendOtp}
                  className="w-full rounded-full bg-leaf-500 py-2.5 font-medium text-white hover:bg-leaf-600"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm text-ink/70">Enter 6-digit code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-leaf-400"
                  />
                </div>
                <button
                  onClick={onConfirmOtp}
                  className="w-full rounded-full bg-leaf-500 py-2.5 font-medium text-white hover:bg-leaf-600"
                >
                  Verify & continue
                </button>
              </>
            )}
          </div>
        )}

        <div className="my-5 flex items-center gap-3 text-xs text-ink/40">
          <span className="h-px flex-1 bg-clay-200" />
          OR
          <span className="h-px flex-1 bg-clay-200" />
        </div>

        <button
          onClick={onGoogleSignIn}
          className="w-full rounded-full border border-clay-300 py-2.5 font-medium text-ink hover:bg-clay-100"
        >
          Continue with Google
        </button>

        {mode === "email" && (
          <button
            onClick={() => setIsSignUp((s) => !s)}
            className="mt-4 w-full text-center text-sm text-leaf-600 hover:underline"
          >
            {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        )}
      </div>
    </main>
  );
}
