/** Homepage Arsenal — full loadout menu (9 packages). */

export type ArsenalTier =
  | "recruit"
  | "soldier"
  | "warrior"
  | "elite"
  | "commander";

export type ArsenalPackageRow = {
  balls: number;
  duration: string;
  durationMinutes: number;
  price: number;
  tier: ArsenalTier;
  classId: "recruit" | "soldier" | "warrior" | "elite" | "commander";
  popular?: boolean;
};

export const MAX_BALLS = 250;
export const MAX_DURATION_MIN = 120;

export const ARSENAL_PACKAGES: ArsenalPackageRow[] = [
  { balls: 30, duration: "30 min", durationMinutes: 30, price: 25, tier: "recruit", classId: "recruit" },
  { balls: 40, duration: "30 min", durationMinutes: 30, price: 30, tier: "recruit", classId: "recruit" },
  { balls: 60, duration: "30 min", durationMinutes: 30, price: 35, tier: "soldier", classId: "soldier" },
  { balls: 80, duration: "40 min", durationMinutes: 40, price: 40, tier: "soldier", classId: "soldier" },
  {
    balls: 100,
    duration: "45 min",
    durationMinutes: 45,
    price: 45,
    tier: "warrior",
    classId: "warrior",
    popular: true,
  },
  { balls: 120, duration: "60 min", durationMinutes: 60, price: 50, tier: "warrior", classId: "warrior" },
  { balls: 160, duration: "1h 30min", durationMinutes: 90, price: 65, tier: "elite", classId: "elite" },
  { balls: 200, duration: "1h30–2h", durationMinutes: 105, price: 75, tier: "elite", classId: "elite" },
  { balls: 250, duration: "2h", durationMinutes: 120, price: 100, tier: "commander", classId: "commander" },
];

export const TIER_ACCENTS: Record<
  ArsenalTier,
  { label: string; color: string; dot: string }
> = {
  recruit: { label: "RECRUIT", color: "#94A3B8", dot: "#94A3B8" },
  soldier: { label: "SOLDIER", color: "#22C55E", dot: "#22C55E" },
  warrior: { label: "WARRIOR", color: "#F97316", dot: "#F97316" },
  elite: { label: "ELITE", color: "#E8001C", dot: "#E8001C" },
  commander: { label: "COMMANDER", color: "#FFD700", dot: "#FFD700" },
};

export type GameModeId = "ctf" | "deathmatch" | "humans_aliens" | "ludo";

export const GAME_MODES: {
  id: GameModeId;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
}[] = [
  {
    id: "ctf",
    icon: "🚩",
    title: "CAPTURE THE FLAG",
    subtitle: "Classic team objective.",
    desc: "Strategy wins.",
  },
  {
    id: "deathmatch",
    icon: "💀",
    title: "DEATH MATCH",
    subtitle: "Last team standing wins.",
    desc: "Pure chaos.",
  },
  {
    id: "humans_aliens",
    icon: "👽",
    title: "HUMANS & ALIENS",
    subtitle: "Survivors vs hunters.",
    desc: "Who survives?",
  },
  {
    id: "ludo",
    icon: "🎲",
    title: "PAINTBALL LUDO",
    subtitle: "Strategy + elimination.",
    desc: "Board meets battlefield.",
  },
];

export const RECHARGES_HOME = [
  { balls: 15, price: 5, color: "#22C55E" },
  { balls: 30, price: 10, color: "#EAB308" },
  { balls: 50, price: 15, color: "#F97316" },
  { balls: 100, price: 30, color: "#E8001C" },
] as const;

export function shotsPerMinute(balls: number, durationMinutes: number): number {
  if (durationMinutes <= 0) return 0;
  return Math.round((balls / durationMinutes) * 10) / 10;
}
