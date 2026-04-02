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

const CREATOR_PROFILE_KEY = "lensd_creator_profile";

type QuizAnswer = {
  shootType: "Photos" | "Videos" | "Both";
  platform: "TikTok" | "Instagram" | "Both";
  gear: "iPhone" | "Camera" | "Both";
  level: "Just Starting" | "Getting Better" | "Pretty Solid" | "I Charge For This";
  vibe: "Urban" | "Dreamy" | "Nature" | "Editorial";
};

type CreatorProfile = {
  type: string;
  tagline: string;
  summary: string;
  answers: QuizAnswer;
};

type QuizOption<T extends string> = {
  label: T;
  emoji?: string;
};

type QuizCard = {
  id: keyof QuizAnswer;
  prompt: string;
  options: QuizOption<QuizAnswer[keyof QuizAnswer]>[];
};

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

const quizCards: QuizCard[] = [
  {
    id: "shootType",
    prompt: "WHAT DO YOU SHOOT?",
    options: [
      { label: "Photos", emoji: "📸" },
      { label: "Videos", emoji: "🎬" },
      { label: "Both", emoji: "🔥" }
    ]
  },
  {
    id: "platform",
    prompt: "WHAT'S YOUR PLATFORM?",
    options: [{ label: "TikTok" }, { label: "Instagram" }, { label: "Both" }]
  },
  {
    id: "gear",
    prompt: "WHAT'S YOUR GEAR?",
    options: [
      { label: "iPhone", emoji: "📱" },
      { label: "Camera", emoji: "📷" },
      { label: "Both" }
    ]
  },
  {
    id: "level",
    prompt: "WHAT'S YOUR SKILL LEVEL?",
    options: [
      { label: "Just Starting" },
      { label: "Getting Better" },
      { label: "Pretty Solid" },
      { label: "I Charge For This" }
    ]
  },
  {
    id: "vibe",
    prompt: "WHAT'S YOUR VIBE?",
    options: [
      { label: "Urban" },
      { label: "Dreamy" },
      { label: "Nature" },
      { label: "Editorial" }
    ]
  }
];

function mapQuizVibeToPlannerVibe(value: QuizAnswer["vibe"]): VibeOption {
  switch (value) {
    case "Urban":
      return "Urban Grit";
    case "Dreamy":
      return "Soft & Dreamy";
    case "Nature":
      return "Nature Escape";
    case "Editorial":
      return "Golden Hour";
  }
}

function buildCreatorProfile(answers: QuizAnswer): CreatorProfile {
  const typeMap: Record<QuizAnswer["vibe"], Record<QuizAnswer["gear"], Record<QuizAnswer["level"], string>>> =
    {
      Urban: {
        iPhone: {
          "Just Starting": "The Street Starter",
          "Getting Better": "The City Climber",
          "Pretty Solid": "The Concrete Stylist",
          "I Charge For This": "The Urban Shotcaller"
        },
        Camera: {
          "Just Starting": "The Raw Frame Rookie",
          "Getting Better": "The Alley Auteur",
          "Pretty Solid": "The Night Shift Shooter",
          "I Charge For This": "The Asphalt Director"
        },
        Both: {
          "Just Starting": "The Sidewalk Switch-Up",
          "Getting Better": "The Motion Scout",
          "Pretty Solid": "The Streetworld Builder",
          "I Charge For This": "The City Vision Boss"
        }
      },
      Dreamy: {
        iPhone: {
          "Just Starting": "The Soft Light Starter",
          "Getting Better": "The Blur Poet",
          "Pretty Solid": "The Mood Weaver",
          "I Charge For This": "The Velvet Visionary"
        },
        Camera: {
          "Just Starting": "The Daydream Framer",
          "Getting Better": "The Haze Sculptor",
          "Pretty Solid": "The Romantic Auteur",
          "I Charge For This": "The Dream Sequence Director"
        },
        Both: {
          "Just Starting": "The Cloud Chaser",
          "Getting Better": "The Soft Motion Muse",
          "Pretty Solid": "The Atmosphere Stylist",
          "I Charge For This": "The Cinematic Whisperer"
        }
      },
      Nature: {
        iPhone: {
          "Just Starting": "The Trail Starter",
          "Getting Better": "The Golden Path Creator",
          "Pretty Solid": "The Wild Frame Finder",
          "I Charge For This": "The Outdoor Story Lead"
        },
        Camera: {
          "Just Starting": "The Forest Framer",
          "Getting Better": "The Terrain Teller",
          "Pretty Solid": "The Natural Light Operator",
          "I Charge For This": "The Earth Tone Director"
        },
        Both: {
          "Just Starting": "The Open Air Explorer",
          "Getting Better": "The Scenic Switch-Up",
          "Pretty Solid": "The Wilderness Stylist",
          "I Charge For This": "The Escape Architect"
        }
      },
      Editorial: {
        iPhone: {
          "Just Starting": "The Taste Scout",
          "Getting Better": "The Layout Learner",
          "Pretty Solid": "The Feed Curator",
          "I Charge For This": "The Culture Editor"
        },
        Camera: {
          "Just Starting": "The Frame Assistant",
          "Getting Better": "The Image Curator",
          "Pretty Solid": "The Scene Director",
          "I Charge For This": "The Visual Director"
        },
        Both: {
          "Just Starting": "The Moodboard Maker",
          "Getting Better": "The Scene Curator",
          "Pretty Solid": "The Multi-Format Director",
          "I Charge For This": "The Brand World Builder"
        }
      }
    };

  const platformTag =
    answers.platform === "Both"
      ? "cross-platform"
      : answers.platform === "TikTok"
        ? "short-form"
        : "editorial-feed";
  const shootTag =
    answers.shootType === "Both"
      ? "photo-and-motion"
      : answers.shootType === "Videos"
        ? "motion-first"
        : "image-led";

  return {
    type: typeMap[answers.vibe][answers.gear][answers.level],
    tagline: `${shootTag} ${platformTag} creator`,
    summary: `You move like a ${answers.vibe.toLowerCase()}-leaning ${answers.gear.toLowerCase()} creative with ${answers.level.toLowerCase()} energy. LENSD will lean your plans toward ${answers.platform.toLowerCase()} moments and ${answers.shootType.toLowerCase()} storytelling.`,
    answers
  };
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.8 2h2.4l.48 2.2c.53.14 1.04.35 1.5.62l2.05-.93 1.7 1.7-.94 2.05c.27.47.48.97.62 1.5L22 10.8v2.4l-2.2.48a6.6 6.6 0 0 1-.62 1.5l.94 2.05-1.7 1.7-2.05-.94c-.47.27-.97.48-1.5.62L13.2 22h-2.4l-.48-2.2a6.6 6.6 0 0 1-1.5-.62l-2.05.94-1.7-1.7.94-2.05a6.6 6.6 0 0 1-.62-1.5L2 13.2v-2.4l2.2-.48c.14-.53.35-1.03.62-1.5l-.94-2.05 1.7-1.7 2.05.93c.47-.27.97-.48 1.5-.62L10.8 2Z" />
      <circle cx="12" cy="12" r="3.1" />
    </svg>
  );
}

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
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Partial<QuizAnswer>>({});
  const [currentQuizCard, setCurrentQuizCard] = useState(0);
  const [showProfileReveal, setShowProfileReveal] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
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

  useEffect(() => {
    const storedProfile = window.localStorage.getItem(CREATOR_PROFILE_KEY);

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as CreatorProfile;
        setCreatorProfile(parsed);
        setVibe(mapQuizVibeToPlannerVibe(parsed.answers.vibe));
      } catch {
        window.localStorage.removeItem(CREATOR_PROFILE_KEY);
      }
    }

    setIsReady(true);
  }, []);

  function handleQuizAnswer(questionId: keyof QuizAnswer, value: QuizAnswer[keyof QuizAnswer]) {
    const nextAnswers = {
      ...quizAnswers,
      [questionId]: value
    } as Partial<QuizAnswer>;

    setQuizAnswers(nextAnswers);

    if (questionId === "vibe") {
      setVibe(mapQuizVibeToPlannerVibe(value as QuizAnswer["vibe"]));
    }

    if (currentQuizCard === quizCards.length - 1) {
      const completedAnswers = nextAnswers as QuizAnswer;
      const nextProfile = buildCreatorProfile(completedAnswers);

      setCreatorProfile(nextProfile);
      setShowProfileReveal(true);
      window.localStorage.setItem(CREATOR_PROFILE_KEY, JSON.stringify(nextProfile));
      setVibe(mapQuizVibeToPlannerVibe(completedAnswers.vibe));
      return;
    }

    setCurrentQuizCard((card) => card + 1);
  }

  function handleRetakeQuiz() {
    window.localStorage.removeItem(CREATOR_PROFILE_KEY);
    setCreatorProfile(null);
    setQuizAnswers({});
    setCurrentQuizCard(0);
    setShowProfileReveal(false);
    setSettingsOpen(false);
    setPlan(null);
    setError("");
    setVibe("Urban Grit");
  }

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

  if (!isReady) {
    return <main className={styles.pageShell} />;
  }

  if (!creatorProfile) {
    return (
      <main className={`${styles.pageShell} ${styles.quizShell}`}>
        <section className={styles.quizScreen}>
          <div className={styles.quizHeader}>
            <p className={styles.eyebrow}>FIRST LOOK</p>
            <h1 className={styles.quizTitle}>LET'S BUILD YOUR CREATOR PROFILE</h1>
            <p className={styles.quizIntro}>
              Swipe through the vibe cards, tap what fits, and LENSD will tune the experience to
              your creative lane.
            </p>
          </div>

          <div className={styles.quizProgress}>
            {quizCards.map((card, index) => (
              <span
                key={card.id}
                className={`${styles.progressDot} ${
                  index <= currentQuizCard ? styles.progressDotActive : ""
                }`}
              />
            ))}
          </div>

          <div className={styles.quizViewport}>
            <div
              className={styles.quizTrack}
              style={{ transform: `translateX(-${currentQuizCard * 100}%)` }}
            >
              {quizCards.map((card, index) => (
                <article className={styles.quizCard} key={card.id}>
                  <p className={styles.quizCounter}>CARD 0{index + 1}</p>
                  <h2 className={styles.quizPrompt}>{card.prompt}</h2>
                  <div className={styles.quizOptions}>
                    {card.options.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        className={styles.quizOption}
                        onClick={() => handleQuizAnswer(card.id, option.label)}
                      >
                        <span className={styles.quizOptionEmoji}>{option.emoji || "✦"}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <p className={styles.quizHint}>TAP AN ANSWER TO SLIDE TO THE NEXT CARD</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.pageShell}>
      <div className={styles.topControls}>
        <button
          type="button"
          className={styles.settingsButton}
          aria-label="Open settings"
          onClick={() => setSettingsOpen((open) => !open)}
        >
          <SettingsIcon />
        </button>
        {settingsOpen ? (
          <div className={styles.settingsMenu}>
            <button type="button" className={styles.settingsMenuButton} onClick={handleRetakeQuiz}>
              RETAKE QUIZ
            </button>
          </div>
        ) : null}
      </div>

      {showProfileReveal ? (
        <section className={styles.profileReveal}>
          <p className={styles.eyebrow}>YOUR CREATOR TYPE</p>
          <article className={styles.profileCard}>
            <span className={styles.profileTag}>{creatorProfile.tagline.toUpperCase()}</span>
            <h2 className={styles.profileTitle}>{creatorProfile.type}</h2>
            <p className={styles.profileSummary}>{creatorProfile.summary}</p>
            <div className={styles.profileStats}>
              <span>{creatorProfile.answers.gear}</span>
              <span>{creatorProfile.answers.platform}</span>
              <span>{creatorProfile.answers.vibe}</span>
              <span>{creatorProfile.answers.level}</span>
            </div>
            <button
              type="button"
              className={styles.generateButton}
              onClick={() => setShowProfileReveal(false)}
            >
              ENTER LENSD
            </button>
          </article>
        </section>
      ) : null}

      <section className={styles.heroPanel}>
        <div className={styles.heroBackdrop} />
        <p className={styles.eyebrow}>CREATIVE SHOOT PLANNER</p>
        <h1 className={styles.heroTitle}>LENSD</h1>
        <p className={styles.heroText}>
          Build a full creative direction deck for your next photo dump, Reel, TikTok, or
          editorial shoot. Pick the city. Pick the energy. LENSD handles the rest.
        </p>

        <article className={styles.creatorProfileBanner}>
          <div>
            <p className={styles.bannerLabel}>CREATOR PROFILE</p>
            <h2 className={styles.bannerTitle}>{creatorProfile.type}</h2>
          </div>
          <p className={styles.bannerText}>{creatorProfile.summary}</p>
        </article>

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
