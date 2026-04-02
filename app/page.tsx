"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ShootPlan, VibeOption } from "@/app/types";
import styles from "./page.module.css";

const vibeOptions: VibeOption[] = [
  "Golden Hour",
  "Urban Grit",
  "Soft & Dreamy",
  "Nature Escape"
];

type ThemeTokens = {
  background: string;
  accent: string;
  text: string;
  button: string;
  buttonText: string;
  muted: string;
  panel: string;
  panelSoft: string;
  border: string;
  inputBg: string;
  inputBorder: string;
  shadow: string;
  glowA: string;
  glowB: string;
};

const vibeThemes: Record<VibeOption, ThemeTokens> = {
  "Golden Hour": {
    background: "#2D1B00",
    accent: "#FFB347",
    text: "#FFF8F0",
    button: "#FF8C00",
    buttonText: "#FFF8F0",
    muted: "rgba(255, 248, 240, 0.78)",
    panel: "rgba(74, 45, 8, 0.78)",
    panelSoft: "rgba(107, 63, 8, 0.62)",
    border: "rgba(255, 179, 71, 0.28)",
    inputBg: "rgba(255, 248, 240, 0.08)",
    inputBorder: "rgba(255, 179, 71, 0.3)",
    shadow: "0 20px 45px rgba(0, 0, 0, 0.42)",
    glowA: "rgba(255, 179, 71, 0.24)",
    glowB: "rgba(255, 140, 0, 0.16)"
  },
  "Urban Grit": {
    background: "#0D0D0D",
    accent: "#FFFFFF",
    text: "#E0E0E0",
    button: "#00FF85",
    buttonText: "#0D0D0D",
    muted: "rgba(224, 224, 224, 0.72)",
    panel: "rgba(24, 24, 24, 0.84)",
    panelSoft: "rgba(255, 255, 255, 0.04)",
    border: "rgba(255, 255, 255, 0.12)",
    inputBg: "rgba(255, 255, 255, 0.05)",
    inputBorder: "rgba(255, 255, 255, 0.12)",
    shadow: "0 20px 45px rgba(0, 0, 0, 0.45)",
    glowA: "rgba(255, 255, 255, 0.14)",
    glowB: "rgba(0, 255, 133, 0.16)"
  },
  "Soft & Dreamy": {
    background: "#1A1A2E",
    accent: "#7EB5A6",
    text: "#FFD6D6",
    button: "#B784A7",
    buttonText: "#FFF8F5",
    muted: "rgba(255, 214, 214, 0.78)",
    panel: "rgba(39, 38, 67, 0.82)",
    panelSoft: "rgba(126, 181, 166, 0.14)",
    border: "rgba(126, 181, 166, 0.22)",
    inputBg: "rgba(255, 214, 214, 0.06)",
    inputBorder: "rgba(126, 181, 166, 0.24)",
    shadow: "0 22px 48px rgba(10, 10, 30, 0.44)",
    glowA: "rgba(126, 181, 166, 0.18)",
    glowB: "rgba(183, 132, 167, 0.16)"
  },
  "Nature Escape": {
    background: "#0D1F0D",
    accent: "#C4A882",
    text: "#E8DCC8",
    button: "#4A7C59",
    buttonText: "#F5F0E8",
    muted: "rgba(232, 220, 200, 0.78)",
    panel: "rgba(21, 44, 24, 0.84)",
    panelSoft: "rgba(74, 124, 89, 0.16)",
    border: "rgba(196, 168, 130, 0.22)",
    inputBg: "rgba(232, 220, 200, 0.05)",
    inputBorder: "rgba(196, 168, 130, 0.24)",
    shadow: "0 22px 48px rgba(3, 12, 4, 0.5)",
    glowA: "rgba(196, 168, 130, 0.16)",
    glowB: "rgba(74, 124, 89, 0.18)"
  }
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.6" r="1.2" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.4 3c.35 2.12 1.66 3.77 3.6 4.42v3.04a7.23 7.23 0 0 1-3.53-1.06l-.03 6.1a5.5 5.5 0 1 1-5.24-5.5c.37 0 .74.04 1.08.12v3.12a2.45 2.45 0 1 0 1.1 2.05V3h3.02Z" />
    </svg>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button type="button" className={styles.copyButton} onClick={handleCopy}>
      {copied ? "COPIED" : `COPY ${label}`}
    </button>
  );
}

export default function HomePage() {
  const [city, setCity] = useState("");
  const [vibe, setVibe] = useState<VibeOption>("Urban Grit");
  const [plan, setPlan] = useState<ShootPlan | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useMemo(() => vibeThemes[vibe], [vibe]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--bg", theme.background);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--white", theme.text);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--gold", theme.accent);
    root.style.setProperty("--neon", theme.button);
    root.style.setProperty("--button", theme.button);
    root.style.setProperty("--button-text", theme.buttonText);
    root.style.setProperty("--muted", theme.muted);
    root.style.setProperty("--panel", theme.panel);
    root.style.setProperty("--panel-soft", theme.panelSoft);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--input-bg", theme.inputBg);
    root.style.setProperty("--input-border", theme.inputBorder);
    root.style.setProperty("--shadow", theme.shadow);
    root.style.setProperty("--glow-a", theme.glowA);
    root.style.setProperty("--glow-b", theme.glowB);
  }, [theme]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ city, vibe })
      });

      const data = (await response.json()) as ShootPlan | { error: string };

      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Failed to generate plan.");
      }

      setPlan(data as ShootPlan);
    } catch (submitError) {
      setPlan(null);
      setError(submitError instanceof Error ? submitError.message : "Unable to generate your plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <div className={styles.heroBackdrop} />
        <p className={styles.eyebrow}>CREATIVE SHOOT PLANNER</p>
        <h1 className={styles.heroTitle}>LENSD</h1>
        <p className={styles.heroText}>
          Build a full creative direction deck for your next photo dump, Reel, TikTok, or
          editorial shoot. Pick the city. Pick the energy. LENSD handles the rest.
        </p>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <label className={styles.fieldLabel} htmlFor="city">
            CITY
          </label>
          <input
            id="city"
            className={styles.textInput}
            placeholder="BROOKLYN, NYC"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
          />

          <label className={styles.fieldLabel} htmlFor="vibe">
            VIBE
          </label>
          <select
            id="vibe"
            className={styles.selectInput}
            value={vibe}
            onChange={(event) => setVibe(event.target.value as VibeOption)}
          >
            {vibeOptions.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>

          <button type="submit" className={styles.generateButton} disabled={loading}>
            {loading ? "BUILDING YOUR PLAN..." : "GENERATE SHOOT PLAN"}
          </button>
        </form>

        {error ? <p className={styles.errorText}>{error}</p> : null}
      </section>

      {plan ? (
        <section className={styles.resultsSection}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>LIVE CREATIVE DIRECTION</p>
              <h2 className={styles.sectionTitle}>
                {plan.city.toUpperCase()} / {plan.vibe.toUpperCase()}
              </h2>
            </div>
            <div className={styles.audioChip}>
              <span className={styles.audioLabel}>TIKTOK AUDIO MOOD</span>
              <span>{plan.tiktokAudioMood}</span>
            </div>
          </div>

          <p className={styles.moodBlock}>{plan.overallMood}</p>

          <div className={styles.locationGrid}>
            {plan.locations.map((location, index) => (
              <article className={styles.locationCard} key={`${location.name}-${index}`}>
                <div className={styles.locationMeta}>
                  <span className={styles.locationIndex}>0{index + 1}</span>
                  <span className={styles.bestTime}>{location.bestTimeOfDay}</span>
                </div>
                <h3 className={styles.locationName}>{location.name}</h3>
                <p className={styles.locationDescription}>{location.vibeDescription}</p>

                <div className={styles.cardBlock}>
                  <h4 className={styles.cardLabel}>OUTFIT ENERGY</h4>
                  <ul className={styles.tokenList}>
                    {location.outfitSuggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.cardBlock}>
                  <h4 className={styles.cardLabel}>PHOTO SHOT LIST</h4>
                  <ul className={styles.detailList}>
                    {location.photoPoses.map((pose) => (
                      <li key={pose}>{pose}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.cardBlock}>
                  <h4 className={styles.cardLabel}>VIDEO MOMENTS</h4>
                  <ul className={styles.detailList}>
                    {location.videoMoments.map((moment) => (
                      <li key={moment}>{moment}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.platformGrid}>
            <article className={styles.platformCard}>
              <div className={styles.platformHeader}>
                <div className={styles.platformTitleWrap}>
                  <InstagramIcon />
                  <h3>INSTAGRAM PACK</h3>
                </div>
                <CopyButton
                  label="CAPTION"
                  value={`${plan.instagram.caption}\n\n${plan.instagram.hashtags.join(" ")}`}
                />
              </div>
              <p className={styles.captionText}>{plan.instagram.caption}</p>
              <p className={styles.hashtagText}>{plan.instagram.hashtags.join(" ")}</p>
            </article>

            <article className={styles.platformCard}>
              <div className={styles.platformHeader}>
                <div className={styles.platformTitleWrap}>
                  <TikTokIcon />
                  <h3>TIKTOK PACK</h3>
                </div>
                <CopyButton
                  label="CAPTION"
                  value={`${plan.tiktok.caption}\n\n${plan.tiktok.hashtags.join(" ")}`}
                />
              </div>
              <p className={styles.captionText}>{plan.tiktok.caption}</p>
              <p className={styles.hashtagText}>{plan.tiktok.hashtags.join(" ")}</p>
            </article>
          </div>
        </section>
      ) : (
        <section className={styles.emptyState}>
          <p className={styles.emptyLabel}>NO PLAN YET</p>
          <h2 className={styles.emptyTitle}>CITY LIGHTS. LOCATION SCOUTING. CONTENT THAT HITS.</h2>
          <p className={styles.emptyText}>
            Start with a city and a vibe, then LENSD turns it into locations, styling, poses,
            Reels moments, captions, hashtags, and an audio direction.
          </p>
        </section>
      )}
    </main>
  );
}
