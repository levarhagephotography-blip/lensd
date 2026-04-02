import { NextResponse } from "next/server";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages?: Message[];
};

const SYSTEM_PROMPT = `You are LENSD's personal photography coach — a warm, encouraging creative friend who also happens to be a professional photographer with years of experience shooting portraits, lifestyle content, street photography, and cinematic iPhone videography.

Your job is to help creators solve real photography problems in the moment — on location, on set, or just trying to level up their craft.

Your tone is:
- Warm and encouraging, like a friend who genuinely believes in them
- Direct and practical — give actual actionable tips, not vague advice
- Creative and inspiring — help them see possibilities they didn't notice
- Confident but never condescending

Keep responses conversational and concise. Use short paragraphs. When giving multiple tips, number them. Never be overly technical unless the person specifically asks. End with something that motivates them to go try it right now.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RequestBody;
    const messages = body.messages;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 600,
        temperature: 0.85,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;

      throw new Error(
        errorPayload?.error?.message || "OpenAI request failed."
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
