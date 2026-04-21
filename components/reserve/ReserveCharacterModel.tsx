"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { ClassId } from "@/data/classes";

type Props = {
  variant: ClassId;
  silhouette?: boolean;
  spin?: boolean;
};

const DARK = "#1a2a1a";
const RED = "#E8001C";

function useAccent(variant: ClassId): string {
  switch (variant) {
    case "recruit":
      return "#94A3B8";
    case "soldier":
      return "#22C55E";
    case "warrior":
      return "#F97316";
    case "elite":
      return RED;
    case "commander":
      return "#FFD700";
    default:
      return RED;
  }
}

function torsoTint(variant: ClassId): string {
  switch (variant) {
    case "recruit":
      return "#2a3035";
    case "soldier":
      return "#1a3a22";
    case "warrior":
      return "#2a2418";
    case "elite":
      return "#2a1818";
    case "commander":
      return "#2a2610";
    default:
      return "#1a3a1a";
  }
}

function variantScale(variant: ClassId): number {
  switch (variant) {
    case "recruit":
      return 0.84;
    case "soldier":
      return 0.98;
    case "warrior":
      return 1.06;
    case "elite":
      return 1.12;
    case "commander":
      return 1.22;
    default:
      return 1;
  }
}

function torsoWidth(variant: ClassId): number {
  if (variant === "elite") return 0.62;
  if (variant === "commander") return 0.6;
  if (variant === "recruit") return 0.46;
  if (variant === "warrior") return 0.58;
  return 0.55;
}

function hopperScale(variant: ClassId): number {
  if (variant === "recruit") return 0.78;
  if (variant === "commander") return 1.18;
  return 1;
}

function gunLen(variant: ClassId): number {
  if (variant === "elite" || variant === "commander") return 0.88;
  if (variant === "recruit") return 0.52;
  return 0.72;
}

export function ReserveCharacterModel({ variant, silhouette = false, spin = true }: Props) {
  const group = useRef<THREE.Group>(null);
  const accent = useAccent(variant);
  const bodyTint = torsoTint(variant);
  const scale = variantScale(variant);
  const vs = silhouette ? 0.7 : 1;
  const shoulder = variant === "warrior" || variant === "elite" ? 0.14 : 0.08;

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.position.y = Math.sin(t * 1.5) * 0.05;
    if (spin) g.rotation.y += 0.008;
  });

  const mat = (color: string, emissive = false, emissiveIntensity = 0.4) => {
    if (silhouette) {
      return (
        <meshBasicMaterial color="#000000" transparent opacity={0.32} depthWrite={false} />
      );
    }
    if (emissive) {
      return (
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.15}
        />
      );
    }
    return <meshStandardMaterial color={color} metalness={0.12} roughness={0.6} />;
  };

  const tw = torsoWidth(variant);
  const hs = hopperScale(variant);
  const gl = gunLen(variant);

  return (
    <group ref={group} scale={[scale * vs, scale * vs, scale * vs]}>
      <mesh position={[-0.18, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.7, 8]} />
        {mat(DARK)}
      </mesh>
      <mesh position={[0.18, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.7, 8]} />
        {mat(DARK)}
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[tw, 0.65, 0.35]} />
        {mat(bodyTint)}
      </mesh>
      {variant === "commander" && !silhouette && (
        <mesh position={[0, 0.42, -0.18]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 0.45, 0.04]} />
          {mat("#FFD700", true, 0.35)}
        </mesh>
      )}
      {(variant === "warrior" || variant === "elite") && (
        <>
          <mesh position={[-0.42, 0.28, 0]} castShadow>
            <boxGeometry args={[shoulder, 0.12, 0.2]} />
            {mat(DARK)}
          </mesh>
          <mesh position={[0.42, 0.28, 0]} castShadow>
            <boxGeometry args={[shoulder, 0.12, 0.2]} />
            {mat(DARK)}
          </mesh>
        </>
      )}
      <mesh position={[-0.38, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.55, 8]} />
        {mat(DARK)}
      </mesh>
      <group position={[0.38, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.55, 8]} />
          {mat(DARK)}
        </mesh>
      </group>
      <mesh position={[0, 0.68, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        {mat("#111111")}
      </mesh>
      <mesh position={[0, 0.66, 0.2]} castShadow>
        <boxGeometry args={[0.32 * hs, 0.12 * hs, 0.05]} />
        {mat(accent, true, silhouette ? 0.2 : 0.55)}
      </mesh>
      <mesh position={[0.45, 0.22, 0.1]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.35]} />
        {mat("#333333")}
      </mesh>
      <mesh position={[0.68, 0.25, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, gl, 8]} />
        {mat("#333333")}
      </mesh>
    </group>
  );
}
