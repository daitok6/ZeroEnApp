'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.28;
    meshRef.current.rotation.x += delta * 0.09;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.15, 1]} />
      <meshStandardMaterial
        color="#00E87A"
        wireframe
        emissive="#00E87A"
        emissiveIntensity={0.35}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function OrbitalParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 90;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.1 + (Math.random() - 0.5) * 0.5;
      arr[i * 3]     = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.6 + Math.sin(angle * 2) * 0.25;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y -= delta * 0.12;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00E87A" size={0.045} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

export function CanvasScene() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 42 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 4]} intensity={2} color="#00E87A" />
      <RotatingMesh />
      <OrbitalParticles />
    </Canvas>
  );
}
