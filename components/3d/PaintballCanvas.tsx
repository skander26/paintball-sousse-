"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { ParticleSystem } from "@/components/3d/ParticleSystem";

/** Caps DPR + keeps renderer sized for mobile visibility */
function PixelRatioAndResize() {
  const gl = useThree((s) => s.gl);
  const set = () => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  };
  useEffect(() => {
    set();
    const onResize = () => set();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [gl]);
  return null;
}

function HeroParticleScene({ mobile }: { mobile: boolean }) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0.35, mobile ? 4 : 6]}
        fov={mobile ? 48 : 42}
      />
      <fog
        attach="fog"
        args={["#050507", mobile ? 2.5 : 4, mobile ? 14 : 18]}
      />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 2]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, 2, 1]} intensity={0.85} color="#E8001C" />
      <ParticleSystem mobile={mobile} />
    </>
  );
}

export function PaintballCanvas({ mobile }: { mobile: boolean }) {
  const dpr = typeof window !== "undefined"
    ? Math.min(window.devicePixelRatio, mobile ? 1 : 2)
    : 1;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 h-full min-h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full"
      aria-hidden
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={mobile ? Math.min(dpr, 1.5) : Math.min(dpr, 2)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }}
      >
        <Suspense fallback={null}>
          <PixelRatioAndResize />
          <HeroParticleScene mobile={mobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
