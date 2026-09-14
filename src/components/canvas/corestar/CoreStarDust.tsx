import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoreStarDustProps {
  reducedMotion?: boolean;
  isDimmed?: boolean;
}

export const CoreStarDust: React.FC<CoreStarDustProps> = ({
  reducedMotion = false,
  isDimmed = false,
}) => {
  const ringRef = useRef<THREE.Points>(null);
  const ambientRef = useRef<THREE.Points>(null);
  const ringMatRef = useRef<THREE.PointsMaterial>(null);
  const ambMatRef = useRef<THREE.PointsMaterial>(null);

  const [ringPositions, ringColors] = useMemo(() => {
    const count = 160;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const warmWhite = new THREE.Color('#f3ebdd');
    const champagne = new THREE.Color('#c9b78f');
    const dustyRose = new THREE.Color('#6f555e');

    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.pow(Math.random(), 1.4) * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.18 * (r / 3.0);

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      const roll = Math.random();
      let col: THREE.Color;
      if (roll < 0.6) {
        col = champagne.clone().lerp(dustyRose, Math.random() * 0.4);
      } else if (roll < 0.85) {
        col = warmWhite.clone().lerp(champagne, Math.random() * 0.6);
      } else {
        col = dustyRose.clone().lerp(champagne, Math.random() * 0.3);
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return [positions, colors];
  }, []);

  const [ambientPositions, ambientColors] = useMemo(() => {
    const count = 35;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const champagne = new THREE.Color('#c9b78f');
    const golden = new THREE.Color('#e8c785');

    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const col = champagne.clone().lerp(golden, Math.random() * 0.5);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return [positions, colors];
  }, []);

  useFrame((_, delta) => {
    // Fade opacity down when background dims
    const targetRingOpacity = isDimmed ? 0.05 : 0.45;
    const targetAmbOpacity = isDimmed ? 0.04 : 0.32;

    if (ringMatRef.current) {
      ringMatRef.current.opacity = THREE.MathUtils.lerp(
        ringMatRef.current.opacity,
        targetRingOpacity,
        0.05
      );
    }
    if (ambMatRef.current) {
      ambMatRef.current.opacity = THREE.MathUtils.lerp(
        ambMatRef.current.opacity,
        targetAmbOpacity,
        0.05
      );
    }

    if (!reducedMotion) {
      if (ringRef.current) {
        ringRef.current.rotation.y += delta * 0.018;
      }
      if (ambientRef.current) {
        ambientRef.current.rotation.y -= delta * 0.008;
        ambientRef.current.rotation.x += delta * 0.004;
      }
    }
  });

  return (
    <group>
      <group rotation={[0.35, 0, -0.15]}>
        <points ref={ringRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ringPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[ringColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={ringMatRef}
            size={0.038}
            sizeAttenuation={true}
            vertexColors={true}
            transparent={true}
            opacity={0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      <points ref={ambientRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ambientPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[ambientColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={ambMatRef}
          size={0.028}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export default CoreStarDust;
