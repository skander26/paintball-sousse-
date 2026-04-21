/** Réservation / carousel — classes réelles (loadouts). */

export type ClassId = "recruit" | "soldier" | "warrior" | "elite" | "commander";

export type ClassStatKey = "firepower" | "speed" | "endurance" | "accuracy";

export type PackageOption = {
  balls: number;
  duration: string;
  durationMinutes: number;
  price: number;
};

export type PaintballClass = {
  id: ClassId;
  name: string;
  tagline: string;
  subtitle: string;
  color: string;
  stats: Record<ClassStatKey, number>;
  description: string;
  /** Variante visuelle 3D */
  model: "recruit" | "soldier" | "warrior" | "elite" | "commander_gold";
  packages: PackageOption[];
  defaultPackage: PackageOption;
  badge?: string;
};

export const PAINTBALL_CLASSES: PaintballClass[] = [
  {
    id: "recruit",
    name: "RECRUIT",
    tagline: "Light & Fast. Perfect start.",
    subtitle: "Best for first-timers",
    color: "#94A3B8",
    stats: { firepower: 1, speed: 5, endurance: 1, accuracy: 3 },
    description: "Light ammo, quick game. Perfect for beginners and kids.",
    model: "recruit",
    packages: [
      { balls: 30, duration: "30 min", durationMinutes: 30, price: 25 },
      { balls: 40, duration: "30 min", durationMinutes: 30, price: 30 },
    ],
    defaultPackage: { balls: 30, duration: "30 min", durationMinutes: 30, price: 25 },
  },
  {
    id: "soldier",
    name: "SOLDIER",
    tagline: "Balanced. Reliable. Ready.",
    subtitle: "Great for casual groups",
    color: "#22C55E",
    stats: { firepower: 2, speed: 4, endurance: 3, accuracy: 3 },
    description: "Standard loadout for casual squads. Good balance of ammo and time.",
    model: "soldier",
    packages: [
      { balls: 60, duration: "30 min", durationMinutes: 30, price: 35 },
      { balls: 80, duration: "40 min", durationMinutes: 40, price: 40 },
    ],
    defaultPackage: { balls: 60, duration: "30 min", durationMinutes: 30, price: 35 },
  },
  {
    id: "warrior",
    name: "WARRIOR",
    tagline: "More Ammo. More Battle.",
    subtitle: "⚡ Most popular choice",
    color: "#F97316",
    stats: { firepower: 3, speed: 3, endurance: 4, accuracy: 4 },
    description: "The sweet spot. Extended battles, solid ammo count. Most teams choose this.",
    model: "warrior",
    badge: "MOST POPULAR",
    packages: [
      { balls: 100, duration: "45 min", durationMinutes: 45, price: 45 },
      { balls: 120, duration: "60 min", durationMinutes: 60, price: 50 },
    ],
    defaultPackage: { balls: 100, duration: "45 min", durationMinutes: 45, price: 45 },
  },
  {
    id: "elite",
    name: "ELITE",
    tagline: "Heavy Loadout. No Mercy.",
    subtitle: "For serious players",
    color: "#E8001C",
    stats: { firepower: 4, speed: 2, endurance: 5, accuracy: 4 },
    description: "Extended session for squads that play to dominate. Maximum battle time.",
    model: "elite",
    packages: [
      { balls: 160, duration: "1h 30min", durationMinutes: 90, price: 65 },
      { balls: 200, duration: "1h30–2h", durationMinutes: 105, price: 75 },
    ],
    defaultPackage: { balls: 160, duration: "1h 30min", durationMinutes: 90, price: 65 },
  },
  {
    id: "commander",
    name: "COMMANDER",
    tagline: "Ultimate. Legendary. 2 Full Hours.",
    subtitle: "⭐ The elite experience",
    color: "#FFD700",
    stats: { firepower: 5, speed: 4, endurance: 5, accuracy: 5 },
    description: "250 balls. 2 full hours. The complete Paintball Sousse experience.",
    model: "commander_gold",
    badge: "ULTIMATE",
    packages: [{ balls: 250, duration: "2h", durationMinutes: 120, price: 100 }],
    defaultPackage: { balls: 250, duration: "2h", durationMinutes: 120, price: 100 },
  },
];

export const RECHARGES_RESERVE = [
  { balls: 15, price: 5, color: "#22C55E" },
  { balls: 30, price: 10, color: "#EAB308" },
  { balls: 50, price: 15, color: "#F97316" },
  { balls: 100, price: 30, color: "#E8001C" },
] as const;

export function getClassById(id: ClassId): PaintballClass | undefined {
  return PAINTBALL_CLASSES.find((c) => c.id === id);
}

export function findPackageOption(
  classId: ClassId,
  balls: number,
): PackageOption | undefined {
  const c = getClassById(classId);
  if (!c) return undefined;
  return c.packages.find((p) => p.balls === balls) ?? c.defaultPackage;
}
