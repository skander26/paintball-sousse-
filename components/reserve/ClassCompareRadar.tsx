"use client";

import { motion } from "framer-motion";
import type { ClassStatKey } from "@/data/classes";
import { PAINTBALL_CLASSES } from "@/data/classes";

const KEYS: ClassStatKey[] = ["firepower", "speed", "endurance", "accuracy"];
const LABELS: Record<ClassStatKey, string> = {
  firepower: "FIRE",
  speed: "SPD",
  endurance: "END",
  accuracy: "ACC",
};

const CX = 120;
const CY = 120;
const R = 78;

function polyPoints(stats: Record<ClassStatKey, number>): string {
  return KEYS.map((k, i) => {
    const angle = (Math.PI * 2 * i) / KEYS.length - Math.PI / 2;
    const v = stats[k] / 5;
    const x = CX + Math.cos(angle) * R * v;
    const y = CY + Math.sin(angle) * R * v;
    return `${x},${y}`;
  }).join(" ");
}

export function ClassCompareRadar() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PAINTBALL_CLASSES.map((c, idx) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          className="rounded-xl border border-white/10 bg-[#12121A] p-4"
        >
          <p className="font-display text-lg tracking-wide" style={{ color: c.color }}>
            {c.name}
          </p>
          <svg viewBox="0 0 240 240" className="mx-auto mt-2 h-48 w-full">
            <polygon
              points={KEYS.map((_, i) => {
                const angle = (Math.PI * 2 * i) / KEYS.length - Math.PI / 2;
                const x = CX + Math.cos(angle) * R;
                const y = CY + Math.sin(angle) * R;
                return `${x},${y}`;
              }).join(" ")}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.12)"
            />
            {[0.25, 0.5, 0.75, 1].map((t) => (
              <polygon
                key={t}
                points={KEYS.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / KEYS.length - Math.PI / 2;
                  const x = CX + Math.cos(angle) * R * t;
                  const y = CY + Math.sin(angle) * R * t;
                  return `${x},${y}`;
                }).join(" ")}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
              />
            ))}
            <motion.polygon
              points={polyPoints(c.stats)}
              fill={`${c.color}33`}
              stroke={c.color}
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            {KEYS.map((k, i) => {
              const angle = (Math.PI * 2 * i) / KEYS.length - Math.PI / 2;
              const lx = CX + Math.cos(angle) * (R + 18);
              const ly = CY + Math.sin(angle) * (R + 18);
              return (
                <text
                  key={k}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[#B0B0C0] font-body text-[10px]"
                >
                  {LABELS[k]}
                </text>
              );
            })}
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
