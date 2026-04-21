"use client";

import { useEffect, useState } from "react";

type Dot = { id: number; x: number; y: number; opacity: number };

const MAX = 8;

export function PaintTrailCursor() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    let id = 0;
    const onMove = (e: MouseEvent) => {
      id += 1;
      const nid = id;
      setDots((prev) => {
        const next: Dot[] = [
          ...prev.slice(-(MAX - 1)),
          { id: nid, x: e.clientX, y: e.clientY, opacity: 1 },
        ];
        return next;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      setDots((prev) =>
        prev.map((d) => ({ ...d, opacity: Math.max(0, d.opacity - 0.12) })).filter((d) => d.opacity > 0.02),
      );
    }, 48);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute h-2 w-2 rounded-full bg-[#E8001C]"
          style={{
            left: d.x,
            top: d.y,
            opacity: d.opacity * 0.55,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 8px rgba(232,0,28,0.6)",
          }}
        />
      ))}
    </div>
  );
}
