/** Deterministic pseudo-random 0–1 from string seed (stable SSR/client). */
function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** ISO week number + year for grouping. */
function weekKey(d: Date): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${weekNo}`;
}

/** Two weekdays (Mon=1 … Fri=5) marked FULL per week. */
function fullWeekdayIndices(weekId: string): Set<number> {
  const pool = [1, 2, 3, 4, 5];
  const h1 = Math.floor(hash01(`${weekId}-a`) * 5);
  let h2 = Math.floor(hash01(`${weekId}-b`) * 5);
  if (h2 === h1) h2 = (h2 + 1) % 5;
  return new Set([pool[h1], pool[h2]]);
}

export type DayAvailability = "open" | "full" | "closed";

export function getDayAvailability(date: Date, today: Date): DayAvailability {
  const day = startOfDay(date);
  const t0 = startOfDay(today);
  if (day < t0) return "closed";

  const dow = day.getDay();
  const isWeekend = dow === 0 || dow === 6;
  const iso = day.toISOString().slice(0, 10);
  const wk = weekKey(day);
  const fullIdx = fullWeekdayIndices(wk);

  if (!isWeekend) {
    if (fullIdx.has(dow)) return "full";
    if (hash01(`avail-${iso}`) > 0.6) return "closed";
    return "open";
  }

  if (hash01(`wkend-${iso}`) < 0.08) return "full";
  return "open";
}

export function isToday(date: Date, today: Date): boolean {
  return startOfDay(date).getTime() === startOfDay(today).getTime();
}

const SLOT_TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00"] as const;

export type TimeSlotState = "open" | "full";

export function getSlotState(date: Date, time: string): TimeSlotState {
  const iso = date.toISOString().slice(0, 10);
  const h = hash01(`slot-${iso}-${time}`);
  return h > 0.82 ? "full" : "open";
}

export function getOpenSlots(date: Date): { time: string; state: TimeSlotState }[] {
  return SLOT_TIMES.map((time) => ({
    time,
    state: getSlotState(date, time),
  }));
}

/** Weekday Mon–Thu: optional promo (Women's -20%). */
export function getPromoForDate(date: Date | null): { active: boolean; label: string } {
  if (!date) {
    return { active: true, label: "WOMEN'S PROMO: -20% (lun–jeu)" };
  }
  const d = date.getDay();
  if (d >= 1 && d <= 4) {
    return {
      active: true,
      label: "WOMEN'S PROMO: -20%",
    };
  }
  return { active: false, label: "" };
}
