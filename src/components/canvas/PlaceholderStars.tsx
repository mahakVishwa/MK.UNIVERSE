import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlaceholderStarsProps {
  reducedMotion?: boolean;
}

/**
 * PlaceholderStars renders a lightweight field of 200 stars.
 * Validates active 3D canvas rendering and respects prefers-reduced-motion.
 */
export const PlaceholderStars: React.FC<PlaceholderStarsProps> = ({ reducedMotion = false }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate a small, deterministic set of 3D point coordinates
  const [positions, colors] = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const baseColor = new THREE.Color('#94a3b8'); // slate-400
    const accentColor = new THREE.Color('#38bdf8'); // sky-400

    for (let i = 0; i < count; i++) {
      // Distribute points in a spherical shell around the origin
      const radius = 3 + Math.random() * 8;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Vary colors slightly between cool white and subtle sky blue
      const mixed = baseColor.clone().lerp(accentColor, Math.random() * 0.6);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    return [pos, col];
  }, []);

  // Frame loop: gentle rotation proves the 3D pipeline works without heavy computation.
  // When reducedMotion is active, rotation is disabled.
  useFrame((_, delta) => {
    if (pointsRef.current && !reducedMotion) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.85}
      />
    </points>
  );
};
