"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function AbstractShape({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={reducedMotion ? 0 : 2} rotationIntensity={reducedMotion ? 0 : 0.5} floatIntensity={reducedMotion ? 0 : 1}>
      <Icosahedron ref={meshRef} args={[2.5, 4]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#c9a15a"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={reducedMotion ? 0 : 0.4}
          speed={reducedMotion ? 0 : 2}
          wireframe={true}
        />
      </Icosahedron>
    </Float>
  );
}

export default function Hero3D() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!mounted) {
    // Static fallback while mounting
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-64 h-64 rounded-full border border-gold-dark/50"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#f0d28a" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#eef0f1" />
        <AbstractShape reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
