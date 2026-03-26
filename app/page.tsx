"use client";

import { FormEvent, useState } from "react";
import { ShootPlan, VibeOption } from "@/app/types";
import styles from "./page.module.css";

const vibeOptions: VibeOption[] = [
  "Golden Hour",
  "Urban Grit",
  "Soft & Dreamy",
  "Nature Escape"
];

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
