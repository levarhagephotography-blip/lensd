import { NextResponse } from "next/server";
import { ShootPlan, VibeOption } from "@/app/types";

type RequestBody = {
  city?: string;
  vibe?: VibeOption;
};

const vibeDirections: Record<VibeOption, string> = {
  "Golden Hour":
    "warm light, rooftop edges, honey tones, editorial confidence, premium but effortless",
  "Urban Grit":
    "raw streetwear energy, textured walls, concrete, chrome, low-light edge, rebellious motion",
  "Soft & Dreamy":
    "airy romance, filmic softness, pastel haze, intimate details, delicate movement",
  "Nature Escape":
    "untamed outdoors, grounded textures, cinematic space, wind movement, relaxed freedom"
};

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("The OpenAI response did not include valid JSON.");
  }

  return JSON.parse(text.slice(start, end + 1)) as ShootPlan;
}

function validatePlan(plan: ShootPlan) {
  if (!plan.locations || plan.locations.length !== 3) {
    throw new Error("Expected exactly 3 shoot locations.");
  }

  for (const location of plan.locations) {
    if (
      location.outfitSuggestions.length !== 3 ||
      location.photoPoses.length !== 5 ||
      location.videoMoments.length !== 5
    ) {
      throw new Error(
        "Each location must include 3 outfit suggestions, 5 photo poses, and 5 video moments."
      );
    }
  }

  if (plan.instagram.hashtags.length < 5 || plan.tiktok.hashtags.length < 5) {
    throw new Error("Platform hashtag packs were incomplete.");
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Missing OPENAI_API_KEY. Add it to .env.local to generate shoot plans."
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RequestBody;
    const city = body.city?.trim();
    const vibe = body.vibe;

    if (!city || !vibe) {
      return NextResponse.json({ error: "City and vibe are required." }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 2200,
        temperature: 0.9,
        response_format: {
          type: "json_object"
        },
        messages: [
          {
            role: "system",
            content: `You are LENSD, a premium creative director for Gen Z photographers, content creators, and lifestyle brands.
Generate a culturally current shoot plan for ${city} with the vibe "${vibe}".
The tone must feel premium, streetwear-aware, and platform-native for TikTok, Instagram Reels, and editorial social content.
Avoid generic tourist suggestions unless they are reframed in a fresh creative way.
Use real-feeling location names or hyper-specific area descriptions that a creator would actually understand in the city.
Each location should feel visually distinct.
Vibe direction: ${vibeDirections[vibe]}

Return only valid JSON with this exact shape:
{
  "city": "string",
  "vibe": "Golden Hour | Urban Grit | Soft & Dreamy | Nature Escape",
  "overallMood": "short paragraph",
  "tiktokAudioMood": "short phrase",
  "locations": [
    {
      "name": "string",
      "vibeDescription": "string",
      "bestTimeOfDay": "string",
      "outfitSuggestions": ["string", "string", "string"],
      "photoPoses": ["string", "string", "string", "string", "string"],
      "videoMoments": ["string", "string", "string", "string", "string"]
    }
  ],
  "instagram": {
    "caption": "string",
    "hashtags": ["string", "string", "string", "string", "string", "string"]
  },
  "tiktok": {
    "caption": "string",
    "hashtags": ["string", "string", "string", "string", "string", "string"]
  }
}

Important constraints:
- Return exactly 3 locations.
- Each location needs exactly 3 outfit suggestions.
- Each location needs exactly 5 photo poses.
- Each location needs exactly 5 video moments tailored to TikTok/Reels language like transitions, walk-aways, close-ups, slow-mo, handheld motion, reveal shots, or beat drops.
- Captions should feel post-ready and distinct between Instagram and TikTok.
- Hashtags must be valid single tags including the # symbol.
- Do not wrap the JSON in markdown fences.`
          },
          {
            role: "user",
            content: `Build the full LENSD shoot plan for ${city} in the "${vibe}" vibe. Return JSON only.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;

      throw new Error(
        errorPayload?.error?.message || "OpenAI request failed while generating the shoot plan."
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const text = payload.choices?.[0]?.message?.content ?? "";

    const plan = extractJson(text);
    validatePlan(plan);

    return NextResponse.json(plan);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong while generating the shoot plan.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
