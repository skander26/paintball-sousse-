"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  SPRING_DAMPING,
  SPRING_STIFFNESS,
} from "@/lib/constants";

type Splat = { id: number; x: number; y: number };

export function SplatCursor() {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(true);
  const [hoverUi, setHoverUi] = useState(false);
  const [splats, setSplats] = useState<Splat[]>([]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING });
  const sy = useSpring(my, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING });
  const gx = useSpring(mx, { stiffness: 180, damping: 26 });
  const gy = useSpring(my, { stiffness: 180, damping: 26 });

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 1023px)");
    const upd = () => setMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    if (mobile || !mounted) return;

    let nextId = 0;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    const onClick = (e: MouseEvent) => {
      nextId += 1;
      const id = nextId;
      setSplats((s) => [...s, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setSplats((s) => s.filter((x) => x.id !== id));
      }, 450);
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, select",
      );
      setHoverUi(!!interactive);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    window.addEventListener("mouseover", onOver, true);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("mouseover", onOver, true);
    };
  }, [mobile, mounted, mx, my]);

  const overlay = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createPortal(
      <AnimatePresence>
        {splats.map((s) => (
          <motion.div
            key={s.id}
            className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 bg-[#E8001C]"
            style={{
              left: s.x,
              top: s.y,
              clipPath:
                "polygon(30% 10%, 70% 5%, 92% 30%, 85% 70%, 60% 92%, 25% 85%, 8% 55%, 12% 25%)",
            }}
            initial={{ scale: 0, opacity: 0.95 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>,
      document.body,
    );
  }, [splats]);

  if (!mounted || mobile) return overlay;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-normal"
        style={{
          translateX: sx,
          translateY: sy,
          width: hoverUi ? 40 : 14,
          height: hoverUi ? 40 : 14,
          marginLeft: hoverUi ? -20 : -7,
          marginTop: hoverUi ? -20 : -7,
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.85)",
          backgroundColor: "#E8001C",
          boxShadow: hoverUi ? "0 0 28px var(--red-glow)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden
      >
        {hoverUi && (
          <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-white">
            FIRE!
          </span>
        )}
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full bg-brand-red/50"
        style={{
          translateX: gx,
          translateY: gy,
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          borderRadius: 9999,
        }}
        aria-hidden
      />
      {overlay}
    </>
  );
}
