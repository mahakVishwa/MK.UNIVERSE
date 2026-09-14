import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TravelState } from '../../../types/travel';
import { getTravelConfigForDestination } from '../../../data/travelConfigs';
import { WormholeStreaks } from './WormholeStreaks';
import { WormholeTunnel } from './WormholeTunnel';
import { WormholeHorizon } from './WormholeHorizon';

interface ProceduralWormholeProps {
  travelState: TravelState;
  reducedMotion?: boolean;
}

/**
 * ProceduralWormhole: Reusable 3D space travel system for MK.UNIVERSE.
 * Orchestrates:
 * - Streaking star filaments stretching and accelerating toward the camera
 * - Procedural curved spacetime tunnel with circular distortion & gravitational waves
 * - Distant gravitational horizon disc drawing depth into the cosmic void
 * - Responsive dynamic camera FOV widening for physical sensation of speed
 * - Restrained, warm/dark cosmic palette (warm star-white, champagne, soft ivory, dusty rose)
 */
export const ProceduralWormhole: React.FC<ProceduralWormholeProps> = ({
  travelState,
  reducedMotion = false,
}) => {
  const { camera } = useThree();
  const baseFovRef = useRef<number>(58);
  const groupRef = useRef<THREE.Group>(null);

  const {
    activeDestination,
    speed,
    stretch,
    tunnelOpacity,
    exitFlash,
    fovOffset,
    isTraveling,
    phase,
  } = travelState;

  const destinationId = activeDestination?.id ?? 'about';
  const config = getTravelConfigForDestination(destinationId);

  // Dynamic Camera Motion: FOV stretching & subtle physical micro-drift
  useFrame((state) => {
    if (!isTraveling || reducedMotion) {
      // Smoothly restore base camera FOV when not traveling
      if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - baseFovRef.current) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, baseFovRef.current, 0.08);
        camera.updateProjectionMatrix();
      }
      return;
    }

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = baseFovRef.current + fovOffset;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.12);
      camera.updateProjectionMatrix();

      // Subtle physical micro-vibration during high-speed travel
      if (speed > 0.2) {
        const time = state.clock.getElapsedTime();
        const rumble = speed * 0.04;
        camera.position.x += (Math.sin(time * 24.0) * 0.5 + Math.cos(time * 38.0) * 0.5) * rumble * 0.08;
        camera.position.y += (Math.cos(time * 28.0) * 0.5 + Math.sin(time * 42.0) * 0.5) * rumble * 0.08;
      }
    }

    // Gentle global tunnel bank / rotation
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(time * 0.8) * 0.05 * config.twist;
    }
  });

  // Only render when travel is underway
  if (!isTraveling && phase === 'idle') {
    return null;
  }

  // Reduced motion travel doesn't render high-speed streaks/tunnel
  if (reducedMotion) {
    return null;
  }

  const streaksProgress = phase === 'departure' ? 0.3 : Math.min(1.0, tunnelOpacity + 0.2);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Procedural Star Filaments / Streaks */}
      <WormholeStreaks
        config={config}
        speed={speed}
        stretch={stretch}
        progress={streaksProgress}
        twist={config.twist}
      />

      {/* 2. Procedural Spacetime Tunnel */}
      <WormholeTunnel
        config={config}
        opacity={tunnelOpacity}
        speed={speed}
        twist={config.twist}
      />

      {/* 3. Distant Gravitational Horizon Disc */}
      <WormholeHorizon
        config={config}
        opacity={tunnelOpacity}
        exitFlash={exitFlash}
      />
    </group>
  );
};
