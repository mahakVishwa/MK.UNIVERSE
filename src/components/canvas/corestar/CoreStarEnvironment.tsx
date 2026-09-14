import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Destination } from '../../../types/navigation';
import { CoreStarSphere } from './CoreStarSphere';
import { CoreStarCorona } from './CoreStarCorona';
import { CoreStarDust } from './CoreStarDust';
import { CoreStarBodies } from './CoreStarBodies';
import { useCoreStarState } from './coreStarState';

interface CoreStarEnvironmentProps {
  destination?: Destination | null;
  reducedMotion?: boolean;
}

// Horizontally elongated orbital semi-major radii matching the scattered celestial bodies
const ORBIT_RADII = [1.3, 2.1, 3.4, 4.8, 6.15] as const;

/**
 * CoreStarEnvironment: Procedural 3D star system for “THE CORE STAR” (About).
 *
 * Art Direction:
 * - Central Sun shifted clearly to the RIGHT side of the composition
 * - Horizontally elongated elliptical orbits spreading celestial objects across the screen
 * - Deep background dimming when an object is clicked, keeping only the clicked object in focus
 */
export const CoreStarEnvironment: React.FC<CoreStarEnvironmentProps> = ({
  reducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef<number>(reducedMotion ? 1.0 : 0.4);
  const targetScale = 1.0;
  const { size } = useThree();
  const [selectedId] = useCoreStarState();

  const isMobile = size.width < 768;

  // Move the Sun clearly to the RIGHT side
  const baseX = isMobile ? 0.8 : 2.45;
  const baseY = isMobile ? 1.0 : 0.0;
  const baseZ = isMobile ? -0.5 : -0.2;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    // Smooth arrival emergence
    if (currentScale.current < 0.999) {
      currentScale.current = THREE.MathUtils.lerp(
        currentScale.current,
        targetScale,
        reducedMotion ? 0.2 : 0.045
      );
      group.scale.setScalar(currentScale.current);
    } else {
      group.scale.setScalar(1.0);
    }

    if (!reducedMotion) {
      // Subtle pointer parallax
      const targetParallaxX = baseX + state.pointer.x * 0.18;
      const targetParallaxY = baseY + state.pointer.y * 0.12;

      group.position.x = THREE.MathUtils.lerp(group.position.x, targetParallaxX, 0.04);
      group.position.y = THREE.MathUtils.lerp(group.position.y, targetParallaxY, 0.04);
      group.position.z = THREE.MathUtils.lerp(group.position.z, baseZ, 0.04);
    } else {
      group.position.set(baseX, baseY, baseZ);
    }
  });

  const isDimmed = selectedId !== null;

  return (
    <group
      ref={groupRef}
      position={[baseX, baseY, baseZ]}
      scale={reducedMotion ? 1.0 : 0.4}
    >
      {/* Background Point Source: deeply dims when an object is focused so clicked body dominates */}
      <pointLight
        position={[0, 0, 0]}
        color="#fcf8f0"
        intensity={isDimmed ? 0.12 : 1.95}
        distance={28}
        decay={2}
      />

      {/* Gentle Ambient Starlight Fill */}
      <ambientLight color="#c9b78f" intensity={isDimmed ? 0.015 : 0.25} />

      {/* Horizontally Elongated Orbital Track Paths across the screen */}
      <group rotation={[1.05, 0.15, 0]} scale={[1.85, 0.75, 1.0]}>
        {ORBIT_RADII.map((radius) => (
          <mesh key={radius}>
            <ringGeometry args={[radius - 0.005, radius + 0.005, 96]} />
            <meshBasicMaterial
              color="#c9b78f"
              transparent={true}
              opacity={isDimmed ? 0.006 : 0.055}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* 1. Central Dimensional Sun representing MAHAK */}
      <CoreStarSphere reducedMotion={reducedMotion} isDimmed={isDimmed} />

      {/* 2. Soft Atmospheric Starlight Corona */}
      <CoreStarCorona reducedMotion={reducedMotion} isDimmed={isDimmed} />

      {/* 3. Horizontally Scattered Celestial Bodies */}
      <CoreStarBodies reducedMotion={reducedMotion} />

      {/* 4. Quiet Orbital Stardust Disc & Solar Embers */}
      <CoreStarDust reducedMotion={reducedMotion} isDimmed={isDimmed} />
    </group>
  );
};

export default CoreStarEnvironment;
