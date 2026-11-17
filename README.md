# GramSahayak AI — Smart Village Assistance System

A multilingual (English, Hindi, Kannada) AI platform connecting rural citizens with
government schemes, crop advisory, and complaint tracking, via a conversational
chatbot and voice assistant.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Firebase**: Authentication (email/password, phone OTP, Google Sign-In), Firestore
  (chat history, complaints), Hosting
- **LLM API** (server-side route, key never exposed to client)
- **Web Speech API** for Speech-to-Text input and Text-to-Speech output

## Project structure

```
src/
  app/
    page.tsx              landing page
    login/                auth (email, phone OTP, Google)
    dashboard/             post-login hub
    chat/                  LLM chatbot with voice
    complaints/             file + track complaints
    schemes/                scheme eligibility browser
    api/chat/route.ts       server-side LLM proxy
  firebase/
    config.ts               Firebase app init
    auth.ts                  auth helper functions
    firestore.ts             chat history + complaint CRUD
  context/
    AuthContext.tsx          current-user state
    LanguageContext.tsx      active language state
  hooks/
    useSpeech.ts             speech-to-text / text-to-speech hook
  components/
    LanguageSwitcher.tsx
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Firebase project config
   (Firebase Console → Project Settings → General → Your apps) and your LLM API key.
3. Enable Email/Password, Phone, and Google sign-in methods in
   Firebase Console → Authentication → Sign-in method.
4. Deploy Firestore rules and indexes:
   ```
   firebase deploy --only firestore:rules,firestore:indexes
   ```
5. Run locally:
   ```
   npm run dev
   ```

## Notes

- `node_modules/` and `.next/` are gitignored — never commit them. Run `npm install`
  after cloning instead.
- Firestore security rules in `firestore.rules` restrict each user to their own
  chat history and complaints.
- The chat API route (`src/app/api/chat/route.ts`) keeps the LLM API key server-side.
