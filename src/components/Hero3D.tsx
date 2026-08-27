"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, Preload, Clone } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import ErrorBoundary from "@/components/ErrorBoundary";

interface CoreModelProps {
  position?: [number, number, number];
  baseScale?: number;
  isBackground?: boolean;
  rotationSpeedOffset?: number;
  reducedMotion?: boolean;
}

function CoreModel({
  position = [0, 0, 0],
  baseScale = 1.5,
  isBackground = false,
  rotationSpeedOffset = 1,
  reducedMotion = false,
}: CoreModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // NOTE: This requires the /public/models/ff360_core.glb file to exist!
  const { scene } = useGLTF("/models/ff360_core.glb");

  const { pointer, size } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;

    // Reduced motion: hold a fixed pose, no rotation, tilt, or hover scaling.
    if (reducedMotion) {
      group.current.scale.setScalar(baseScale);
      group.current.rotation.set(0.15, 0.6, -0.1);
      return;
    }

    // Smoothly scale up on hover (only for the main foreground model)
    const targetScale = (hovered && !isBackground) ? baseScale * 1.15 : baseScale;
    const currentScale = group.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    group.current.scale.setScalar(newScale);

    // Rotate on Y axis, faster when hovered (foreground only)
    const baseRotSpeed = 0.2 * rotationSpeedOffset;
    const rotationSpeed = (hovered && !isBackground) ? 0.8 : baseRotSpeed;
    group.current.rotation.y += delta * rotationSpeed;

    if (!isBackground) {
      // Tilt based on mouse position (normalized device coordinates: -1 to +1)
      const isTouch = typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches;
      const rotationMultiplier = isTouch || size.width < 768 ? 0.2 : 1.0;

      const targetRotationX = pointer.y * 0.5 * rotationMultiplier; // Up/down tilt
      const targetRotationZ = -pointer.x * 0.5 * rotationMultiplier; // Left/right tilt

      // Lerp towards target rotation for a heavy, tactile feel
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotationZ, 0.05);
    } else {
      // Background models float gently
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 * rotationSpeedOffset) * 0.2;
    }
  });

  return (
    <group
      ref={group}
      position={position}
      // Static starting pose so reduced motion looks right even before the
      // first frame; useFrame keeps it there.
      rotation={reducedMotion ? [0.15, 0.6, -0.1] as const : undefined}
      scale={reducedMotion ? baseScale : undefined}
      onPointerOver={() => !isBackground && !reducedMotion && setHovered(true)}
      onPointerOut={() => !isBackground && !reducedMotion && setHovered(false)}
    >
      <Clone object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="font-mono text-sm tracking-widest text-silver-light whitespace-nowrap">
        INITIALIZING 3D ENGINE...
      </div>
    </Html>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const isMobile = size.width < 768;
    if (camera instanceof THREE.PerspectiveCamera) {
      // eslint-disable-next-line react-hooks/immutability
      camera.position.z = isMobile ? 10 : 5;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width]);

  return null;
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const width = useThree((s) => s.size.width);
  // Fewer background instances on small screens — five GLB clones lerping every
  // frame is a lot of work for a phone.
  const backgroundModels = (
    [
      { position: [-6.5, 1.5, -4], baseScale: 0.6, rotationSpeedOffset: -0.8 },
      { position: [7.5, -1.8, -6], baseScale: 0.8, rotationSpeedOffset: 0.6 },
      { position: [-8.0, -2.5, -8], baseScale: 1.2, rotationSpeedOffset: -0.4 },
      { position: [8.5, 2.0, -10], baseScale: 1.5, rotationSpeedOffset: 0.5 },
    ] satisfies CoreModelProps[]
  ).slice(0, width < 768 ? 1 : 4);

  return (
    <>
      <CoreModel position={[0, 0, 0]} baseScale={1.5} reducedMotion={reducedMotion} />
      {backgroundModels.map((props, i) => (
        <CoreModel key={i} {...props} isBackground reducedMotion={reducedMotion} />
      ))}
      <Preload all />
    </>
  );
}

export default function Hero3D() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
     <ErrorBoundary fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <ResponsiveCamera />
        {/* Environment & Lighting */}
        <ambientLight intensity={0.2} color="#ffffff" />

        {/* Primary Gold Spotlight */}
        <spotLight
          position={[5, 5, 5]}
          angle={0.15}
          penumbra={1}
          intensity={50}
          color="#c9a15a"
          castShadow
        />

        {/* Fill Light for depth */}
        <spotLight
          position={[-5, -5, -5]}
          angle={0.2}
          penumbra={1}
          intensity={20}
          color="#17171a"
        />

        {/* Subtle Background Illumination */}
        <pointLight position={[-8, 0, -6]} intensity={0.5} color="#c9a15a" distance={15} />
        <pointLight position={[8, 0, -8]} intensity={0.3} color="#ffffff" distance={15} />

        <Suspense fallback={<Loader />}>
          <Scene reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
     </ErrorBoundary>
    </div>
  );
}

// Preload the model so it starts fetching immediately
useGLTF.preload("/models/ff360_core.glb");
