"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export type Pose = "stand" | "crouch" | "run";

type Props = {
  pose?: Pose;
  hovered?: boolean;
};

const DARK = "#1a2a1a";
const GREEN = "#1a3a1a";
const RED = "#E8001C";

export function PaintballCharacter({ pose = "stand", hovered = false }: Props) {
  const group = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  const yScale = pose === "crouch" ? 0.7 : 1;
  const tilt = pose === "run" ? 0.17 : 0;

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.position.y = Math.sin(t * 1.2) * 0.06;
    if (pose === "stand") g.rotation.y = Math.sin(t * 0.35) * 0.08;
    if (pose === "run") g.rotation.x = tilt;

    const ra = rightArm.current;
    if (ra) {
      const targetZ = hovered ? -Math.PI / 2 + 0.2 : -Math.PI / 4;
      ra.rotation.z = THREE.MathUtils.lerp(ra.rotation.z, targetZ, 0.12);
    }
  });

  return (
    <group ref={group} scale={[1, yScale, 1]}>
      <mesh position={[-0.18, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.7, 8]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      <mesh position={[0.18, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.7, 8]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.35]} />
        <meshStandardMaterial color={GREEN} metalness={0.1} />
      </mesh>
      <mesh position={[-0.38, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.55, 8]} />
        <meshStandardMaterial color={DARK} />
      </mesh>
      <group ref={rightArm} position={[0.38, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.55, 8]} />
          <meshStandardMaterial color={DARK} />
        </mesh>
      </group>
      <mesh position={[0, 0.68, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0, 0.66, 0.2]} castShadow>
        <boxGeometry args={[0.32, 0.12, 0.05]} />
        <meshStandardMaterial
          color={RED}
          emissive={RED}
          emissiveIntensity={hovered ? 0.9 : 0.45}
        />
      </mesh>
      <mesh position={[0.45, 0.22, 0.1]} castShadow>
        <boxGeometry args={[0.12, 0.12, 0.35]} />
        <meshStandardMaterial color="#333333" metalness={0.85} />
      </mesh>
      <mesh position={[0.68, 0.25, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.85} />
      </mesh>
    </group>
  );
}
