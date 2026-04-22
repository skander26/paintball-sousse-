import { create } from "zustand";
import type { ClassId } from "@/data/classes";
import { findPackageOption, getClassById } from "@/data/classes";
import type { GameModeId } from "@/data/packages";
import { GAME_MODES } from "@/data/packages";
import { getPromoForDate } from "@/lib/reserveCalendar";

export type Player = {
  id: string;
  name: string;
  team: "red" | "blue";
  classId: ClassId | null;
  className: string;
  balls: number;
  price: number;
  durationMinutes: number;
  durationLabel: string;
};

export type Step = 1 | 2 | 3 | 4;

export type SquadPhase = "size" | "mode" | "classes";

type ReservationState = {
  step: Step;
  introSkipped: boolean;
  introComplete: boolean;
  selectedDate: Date | null;
  selectedTime: string | null;
  totalPlayers: number;
  players: Player[];
  squadPhase: SquadPhase;
  currentPlayerIndex: number;
  gameModeId: GameModeId | null;
  compareOpen: boolean;
  ambientOn: boolean;
  navigationDirection: 1 | -1;
  preselectedClassId: ClassId | null;
  preselectedBalls: number | null;

  setStep: (step: Step) => void;
  setIntroSkipped: (v: boolean) => void;
  setIntroComplete: (v: boolean) => void;
  setDate: (d: Date | null) => void;
  setTime: (t: string | null) => void;
  setTotalPlayers: (n: number) => void;
  setSquadPhase: (p: SquadPhase) => void;
  setCurrentPlayerIndex: (i: number) => void;
  setGameMode: (id: GameModeId | null) => void;
  assignPlayerLoadout: (
    playerId: string,
    classId: ClassId,
    pkg: { balls: number; price: number; durationMinutes: number; durationLabel: string },
    name?: string,
  ) => void;
  setPlayerCallsign: (playerId: string, name: string) => void;
  setCompareOpen: (v: boolean) => void;
  setAmbientOn: (v: boolean) => void;
  setNavigationDirection: (d: 1 | -1) => void;
  setPreselection: (classId: ClassId | null, balls: number | null) => void;
  getTotalCost: () => number;
  getPromoPercent: () => number;
  getRedTeam: () => Player[];
  getBlueTeam: () => Player[];
  getSquadBalanceScore: () => { label: string; pct: number };
  allClassesAssigned: () => boolean;
  getMissionTotalBalls: () => number;
  getMissionAvgDurationMinutes: () => number;
  getGameModeLabel: () => string;
  reset: () => void;
};

function buildPlayers(count: number): Player[] {
  const n = Math.min(20, Math.max(6, count));
  const redCount = Math.ceil(n / 2);
  const out: Player[] = [];
  for (let i = 0; i < n; i += 1) {
    const team: "red" | "blue" = i < redCount ? "red" : "blue";
    out.push({
      id: `P${i + 1}`,
      name: "",
      team,
      classId: null,
      className: "",
      balls: 0,
      price: 0,
      durationMinutes: 0,
      durationLabel: "",
    });
  }
  return out;
}

function uniqueClasses(players: Player[]): Set<ClassId> {
  const s = new Set<ClassId>();
  players.forEach((p) => {
    if (p.classId) s.add(p.classId);
  });
  return s;
}

const initial = {
  step: 1 as Step,
  introSkipped: false,
  introComplete: false,
  selectedDate: null as Date | null,
  selectedTime: null as string | null,
  totalPlayers: 6,
  players: buildPlayers(6),
  squadPhase: "size" as SquadPhase,
  currentPlayerIndex: 0,
  gameModeId: null as GameModeId | null,
  compareOpen: false,
  ambientOn: false,
  navigationDirection: 1 as 1 | -1,
  preselectedClassId: null as ClassId | null,
  preselectedBalls: null as number | null,
};

export const useReservationStore = create<ReservationState>((set, get) => ({
  ...initial,

  setStep: (step) => set({ step }),
  setIntroSkipped: (introSkipped) => set({ introSkipped }),
  setIntroComplete: (introComplete) => set({ introComplete }),
  setDate: (selectedDate) => set({ selectedDate }),
  setTime: (selectedTime) => set({ selectedTime }),

  setTotalPlayers: (count) => {
    const n = Math.min(20, Math.max(6, count));
    set({
      totalPlayers: n,
      players: buildPlayers(n),
      squadPhase: "size",
      currentPlayerIndex: 0,
      gameModeId: null,
    });
  },

  setSquadPhase: (squadPhase) => set({ squadPhase }),
  setCurrentPlayerIndex: (currentPlayerIndex) => set({ currentPlayerIndex }),
  setGameMode: (gameModeId) => set({ gameModeId }),
  setCompareOpen: (compareOpen) => set({ compareOpen }),
  setAmbientOn: (ambientOn) => set({ ambientOn }),
  setNavigationDirection: (navigationDirection) => set({ navigationDirection }),
  setPreselection: (preselectedClassId, preselectedBalls) =>
    set({ preselectedClassId, preselectedBalls }),

  assignPlayerLoadout: (playerId, classId, pkg, name) => {
    const pc = getClassById(classId);
    if (!pc) return;
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              classId,
              className: pc.name,
              balls: pkg.balls,
              price: pkg.price,
              durationMinutes: pkg.durationMinutes,
              durationLabel: pkg.durationLabel,
              name: name !== undefined ? name.trim() : p.name,
            }
          : p,
      ),
    }));
  },

  setPlayerCallsign: (playerId, name) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, name: name.trim() } : p,
      ),
    }));
  },

  getPromoPercent: () => {
    const { selectedDate } = get();
    if (!selectedDate) return 0;
    return getPromoForDate(selectedDate).active ? 20 : 0;
  },

  getTotalCost: () => {
    const state = get();
    const sub = state.players.reduce((sum, p) => sum + p.price, 0);
    const pct = state.getPromoPercent();
    return Math.round(sub * (1 - pct / 100));
  },

  getRedTeam: () => get().players.filter((p) => p.team === "red"),

  getBlueTeam: () => get().players.filter((p) => p.team === "blue"),

  allClassesAssigned: () => get().players.every((p) => p.classId !== null),

  getMissionTotalBalls: () =>
    get().players.reduce((s, p) => s + (p.classId ? p.balls : 0), 0),

  getMissionAvgDurationMinutes: () => {
    const list = get().players.filter((p) => p.classId);
    if (list.length === 0) return 0;
    const sum = list.reduce((s, p) => s + p.durationMinutes, 0);
    return Math.round(sum / list.length);
  },

  getGameModeLabel: () => {
    const id = get().gameModeId;
    if (!id) return "—";
    return GAME_MODES.find((m) => m.id === id)?.title ?? id;
  },

  getSquadBalanceScore: () => {
    const u = uniqueClasses(get().players);
    const n = u.size;
    if (n <= 1) {
      return { label: "FAST BUT FRAGILE — LOW VARIETY", pct: 65 };
    }
    if (n >= 4) {
      return { label: "PERFECT FORMATION — ELITE MIX", pct: 95 };
    }
    if (n === 3) {
      return { label: "SOLID LINEUP — HIGH BALANCE", pct: 88 };
    }
    return { label: "BALANCED SQUAD — GOOD MIX", pct: 78 };
  },

  reset: () =>
    set({
      ...initial,
      introComplete: true,
      introSkipped: true,
      players: buildPlayers(6),
      gameModeId: null,
      preselectedClassId: null,
      preselectedBalls: null,
    }),
}));

export function pickRandomGameMode(): GameModeId {
  const idx = Math.floor(Math.random() * GAME_MODES.length);
  return GAME_MODES[idx].id;
}
