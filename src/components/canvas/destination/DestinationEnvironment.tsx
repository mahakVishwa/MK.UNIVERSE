import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Destination } from '../../../types/navigation';
import { getTravelConfigForDestination } from '../../../data/travelConfigs';

interface DestinationEnvironmentProps {
  destination: Destination | null;
  reducedMotion?: boolean;
}

/**
 * DestinationEnvironment: Minimal placeholder 3D starlight environment.
 * Renders a quiet, peaceful starlight field softly tinted with the destination's
 * celestial starlight palette. Validates that the traveler has successfully exited
 * the wormhole and arrived at the new cosmic coordinates.
 */
export const DestinationEnvironment: React.FC<DestinationEnvironmentProps> = ({
  destination,
  reducedMotion = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const config = getTravelConfigForDestination(destination?.id ?? 'about');

  const [positions, colors] = useMemo(() => {
    const count = 250;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const primary = new THREE.Color(config.primaryColor);
    const secondary = new THREE.Color(config.secondaryColor);
    const accent = new THREE.Color(config.accentColor);

    for (let i = 0; i < count; i++) {
      // Distribute in spherical field around destination origin
      const radius = 2.5 + Math.random() * 9.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const roll = Math.random();
      let starCol: THREE.Color;
      if (roll < 0.6) {
        starCol = primary.clone().lerp(secondary, Math.random() * 0.5);
      } else {
        starCol = secondary.clone().lerp(accent, Math.random() * 0.6);
      }

      col[i * 3] = starCol.r;
      col[i * 3 + 1] = starCol.g;
      col[i * 3 + 2] = starCol.b;
    }

    return [pos, col];
  }, [config]);

  useFrame((_, delta) => {
    if (pointsRef.current && !reducedMotion) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Subtle warm ambient illumination reflecting destination star */}
      <ambientLight intensity={0.4} color={config.secondaryColor} />

      {/* Quiet restful starlight field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.88}
        />
      </points>
    </group>
  );
};
