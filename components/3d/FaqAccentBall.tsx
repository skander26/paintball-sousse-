"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Ball() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    m.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.25;
    m.rotation.x += 0.01;
    m.rotation.y += 0.014;
  });
  return (
    <mesh ref={mesh} scale={0.35}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial color="#E8001C" emissive="#E8001C" emissiveIntensity={0.45} roughness={0.35} />
    </mesh>
  );
}

export function FaqAccentBall() {
  return (
    <div className="pointer-events-none absolute bottom-8 end-8 h-32 w-32 opacity-80 md:h-40 md:w-40">
      <Canvas gl={{ alpha: true }} dpr={1}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <pointLight position={[1, 2, 2]} intensity={1.5} color="#ff4d5c" />
          <Ball />
        </Suspense>
      </Canvas>
    </div>
  );
}
