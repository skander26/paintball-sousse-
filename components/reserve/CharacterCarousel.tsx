"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import type { ClassId } from "@/data/classes";
import { PAINTBALL_CLASSES, getClassById } from "@/data/classes";
import { ReserveCharacterModel } from "@/components/reserve/ReserveCharacterModel";
import { playSwoosh } from "@/lib/reserveSounds";
import { DURATION_NORMAL_S } from "@/lib/constants";

const ORDER: ClassId[] = PAINTBALL_CLASSES.map((c) => c.id);

function indexOfClass(id: ClassId): number {
  return ORDER.indexOf(id);
}

function PulsingPlatform({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = mesh.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = 0.55 + Math.sin(clock.elapsedTime * 2) * 0.28;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
      <cylinderGeometry args={[1.15, 1.15, 0.06, 48]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.75}
        metalness={0.4}
        roughness={0.35}
      />
    </mesh>
  );
}

function Scene({
  activeId,
  mobile,
  silhouettesEachSide,
}: {
  activeId: ClassId;
  mobile: boolean;
  silhouettesEachSide: number;
}) {
  const idx = indexOfClass(activeId);
  const leftIds: ClassId[] = [];
  const rightIds: ClassId[] = [];
  for (let s = 1; s <= silhouettesEachSide; s += 1) {
    const li = idx - s;
    const ri = idx + s;
    if (li >= 0) leftIds.push(ORDER[li]);
    if (ri < ORDER.length) rightIds.push(ORDER[ri]);
  }

  const spread = mobile ? 1.05 : 1.35;
  const sideScale = mobile ? 0.65 : 0.72;
  const c = getClassById(activeId);
  const platformColor = c?.color ?? "#E8001C";

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.35, 3.2]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 6, 4]} intensity={1.1} />
      <pointLight position={[0, 2.5, 1]} intensity={1.2} color={platformColor} distance={8} />
      <pointLight position={[-2, 1, 2]} intensity={0.35} color="#ffffff" />

      {leftIds.map((id, i) => (
        <group key={`L-${id}`} position={[-spread * (i + 1), -0.2, 0.2]} scale={[sideScale, sideScale, sideScale]}>
          <ReserveCharacterModel variant={id} silhouette spin={false} />
        </group>
      ))}

      <PulsingPlatform color={platformColor} />

      <group position={[0, -0.05, 0]}>
        <ReserveCharacterModel variant={activeId} spin />
      </group>

      {rightIds.map((id, i) => (
        <group key={`R-${id}`} position={[spread * (i + 1), -0.2, 0.2]} scale={[sideScale, sideScale, sideScale]}>
          <ReserveCharacterModel variant={id} silhouette spin={false} />
        </group>
      ))}
    </>
  );
}

type Props = {
  activeId: ClassId;
  onChange: (id: ClassId) => void;
  mobile: boolean;
};

export function CharacterCarousel({ activeId, onChange, mobile }: Props) {
  const [slide, setSlide] = useState(0);
  const [dpr, setDpr] = useState(1);
  const silhouettesEachSide = mobile ? 1 : 2;

  useEffect(() => {
    setDpr(mobile ? 1 : Math.min(window.devicePixelRatio, 2));
  }, [mobile]);

  const idx = useMemo(() => indexOfClass(activeId), [activeId]);

  const go = (dir: -1 | 1) => {
    playSwoosh();
    const next = (idx + dir + ORDER.length) % ORDER.length;
    onChange(ORDER[next]);
    setSlide((s) => s + dir);
  };

  const touchRef = useRef<{ x: number; t: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, t: Date.now() };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    if (Math.abs(dx) < 48) return;
    if (dx < 0) go(1);
    else go(-1);
  };

  const h = mobile ? 280 : 380;

  return (
    <div
      className="relative w-full"
      style={{ height: h }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <motion.button
        type="button"
        aria-label="Classe précédente"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 font-display text-4xl text-white/90 md:text-5xl"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => go(-1)}
      >
        ‹
      </motion.button>
      <motion.button
        type="button"
        aria-label="Classe suivante"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 font-display text-4xl text-white/90 md:text-5xl"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => go(1)}
      >
        ›
      </motion.button>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${activeId}-${slide}`}
          className="mx-auto h-full w-[min(100%,420px)]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: DURATION_NORMAL_S, ease: [0.22, 1, 0.36, 1] }}
        >
          <Canvas
            dpr={dpr}
            gl={{ alpha: true, antialias: true }}
            className="touch-none"
          >
            <Scene activeId={activeId} mobile={mobile} silhouettesEachSide={silhouettesEachSide} />
          </Canvas>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function useReserveMobile(): boolean {
  const [m, setM] = useState(true);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)");
    const u = () => setM(q.matches);
    u();
    q.addEventListener("change", u);
    return () => q.removeEventListener("change", u);
  }, []);
  return m;
}
