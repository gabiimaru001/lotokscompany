"use client";

/// <reference types="@react-three/fiber" />

import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { VideoTexture, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function VideoPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const v = document.createElement("video");
    v.src = "/hero-video.mp4";
    v.crossOrigin = "Anonymous";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    videoRef.current = v;

    const handleLoadedData = () => {
      if (isMounted) setIsLoaded(true);
    };
    const handleError = () => {
      if (isMounted) setError(true);
    };

    v.addEventListener("loadeddata", handleLoadedData);
    v.addEventListener("error", handleError);

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.error("Video play failed:", err);
        if (isMounted) setError(true);
      });
    }

    return () => {
      isMounted = false;
      v.removeEventListener("loadeddata", handleLoadedData);
      v.removeEventListener("error", handleError);
      v.pause();
      v.src = "";
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const { x, y } = state.mouse;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      x * 0.1,
      0.05
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -y * 0.1,
      0.05
    );

    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  if (error) {
    // Fallback - return null to avoid type issues with R3F elements in Next.js
    return null;
  }

  if (!isLoaded) {
    return null;
  }

  const video = videoRef.current!;

  return (
    <mesh ref={meshRef} scale={[16, 9, 1]}>
      <planeGeometry args={[1.2, 1.2, 32, 32]} />
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach="map" args={[video]} colorSpace={THREE.SRGBColorSpace} />
      </meshBasicMaterial>
    </mesh>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const count = 1000;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.05;
    points.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#2349e1"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function Hero3D({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden bg-surface ${className}`}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <VideoPlane />
          <Particles />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/80" />
    </div>
  );
}
