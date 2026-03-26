export type VibeOption =
  | "Golden Hour"
  | "Urban Grit"
  | "Soft & Dreamy"
  | "Nature Escape";

export type ShootLocation = {
  name: string;
  vibeDescription: string;
  bestTimeOfDay: string;
  outfitSuggestions: string[];
  photoPoses: string[];
  videoMoments: string[];
};

export type PlatformPack = {
  caption: string;
  hashtags: string[];
};

export type ShootPlan = {
  city: string;
  vibe: VibeOption;
  overallMood: string;
  tiktokAudioMood: string;
  locations: ShootLocation[];
  instagram: PlatformPack;
  tiktok: PlatformPack;
};
