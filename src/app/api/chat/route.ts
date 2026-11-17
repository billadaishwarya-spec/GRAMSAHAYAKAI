// src/app/api/chat/route.ts
// Server-side route so the LLM API key never reaches the client.
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are GramSahayak, a multilingual assistant for rural Indian citizens.
You help with: government scheme eligibility, required documents, crop/agriculture advisory,
and guiding users to file or track complaints. Always reply in the same language the user wrote in
(English, Hindi, or Kannada). Keep answers short, plain-language, and avoid jargon, since many
users have low literacy. If you don't know a scheme's exact details, say so rather than guessing.`;

export async function POST(req: NextRequest) {
  try {
    const { message, language, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing LLM_API_KEY. Add it to .env" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system: `${SYSTEM_PROMPT}\nRespond in language code: ${language || "en"}.`,
        messages: [
          ...(Array.isArray(history) ? history : []),
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: errText }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.content?.find((c: { type: string }) => c.type === "text")?.text ?? "";

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
