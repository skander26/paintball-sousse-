"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function BallMesh() {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#E8001C") },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          float pulse = sin(vPos.y * 14.0 + uTime * 3.0) * 0.08 + 0.92;
          float fres = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
          vec3 col = uColor * pulse + fres * vec3(1.0, 0.85, 0.85);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    return mat;
  }, []);

  useFrame(({ clock }) => {
    const m = mesh.current;
    const mat = m?.material as THREE.ShaderMaterial | undefined;
    if (!m || !mat) return;
    mat.uniforms.uTime.value = clock.elapsedTime;
    m.rotation.y += 0.008;
    m.rotation.x += 0.003;
  });

  return (
    <mesh ref={mesh} material={material} scale={1.25}>
      <icosahedronGeometry args={[1, 3]} />
    </mesh>
  );
}

export function TournamentBallScene() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
      <Canvas gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 3.4]} />
          <ambientLight intensity={0.25} />
          <pointLight position={[2, 3, 2]} intensity={2.4} color="#E8001C" />
          <BallMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
