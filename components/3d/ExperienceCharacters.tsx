"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PaintballCharacter } from "@/components/3d/PaintballCharacter";

function Row() {
  const group = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const x = mouse.x * 0.45;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x, 0.06);
  });

  return (
    <group ref={group}>
      <group position={[-1.1, -0.35, 0]}>
        <PaintballCharacter pose="run" />
      </group>
      <group position={[0, -0.45, 0]} scale={[0.95, 0.95, 0.95]}>
        <PaintballCharacter pose="crouch" />
      </group>
      <group position={[1.15, -0.35, 0]}>
        <PaintballCharacter pose="stand" />
      </group>
    </group>
  );
}

export function ExperienceCharacters({ mobile }: { mobile: boolean }) {
  const [dpr, setDpr] = useState(1);
  useEffect(() => {
    setDpr(mobile ? 1 : Math.min(window.devicePixelRatio, 2));
  }, [mobile]);

  return (
    <div className="h-[280px] w-full md:h-[320px]">
      <Canvas
        dpr={dpr}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0.2, 4]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 5, 2]} intensity={1} />
          <Row />
        </Suspense>
      </Canvas>
    </div>
  );
}
