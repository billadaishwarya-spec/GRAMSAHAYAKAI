// src/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

const googleProvider = new GoogleAuthProvider();

async function createUserProfile(user: User, extra: Record<string, unknown> = {}) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? null,
      phoneNumber: user.phoneNumber ?? null,
      displayName: user.displayName ?? null,
      createdAt: serverTimestamp(),
      preferredLanguage: "en",
      ...extra,
    },
    { merge: true }
  );
}

export async function signUpWithEmail(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(cred.user);
  return cred.user;
}

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  await createUserProfile(cred.user);
  return cred.user;
}

// Phone OTP flow: setUpRecaptcha must run in a browser context (needs a DOM node id)
export function setUpRecaptcha(containerId: string) {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
}

export async function sendOtp(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export async function confirmOtp(confirmation: ConfirmationResult, code: string) {
  const cred = await confirmation.confirm(code);
  await createUserProfile(cred.user);
  return cred.user;
}

export async function logOut() {
  await signOut(auth);
}
