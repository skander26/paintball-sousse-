"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  color?: string;
  mobile?: boolean;
};

export function ParticleSystem({
  color = "#E8001C",
  mobile = false,
}: Props) {
  const ref = useRef<THREE.Points>(null);
  const count = mobile ? 80 : 250;
  const pointSize = mobile ? 0.12 : 0.06;
  const opacity = mobile ? 1 : 0.7;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const spreadXY = mobile ? 5 : 8;
    const spreadZ = mobile ? 3 : 4;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spreadXY;
      pos[i * 3 + 1] = Math.random() * -5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = Math.random() * 0.04 + 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const pos = mesh.geometry.attributes.position.array as Float32Array;
    const velArr = velocities;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velArr[i * 3];
      pos[i * 3 + 1] += velArr[i * 3 + 1];
      pos[i * 3 + 2] += velArr[i * 3 + 2];
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
    }
    mesh.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={pointSize}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
