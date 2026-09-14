import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GuideCompanionProps {
  visible: boolean;
  reducedMotion?: boolean;
}

/**
 * GuideCompanion: A lightweight, procedural 3D cosmic companion.
 * Features:
 * - Smooth entrance drift from the cosmos
 * - Gentle hover oscillation and orbital ring precession
 * - Expressive starlight gaze following pointer coordinates
 * - Full reduced-motion safeguard
 */
export const GuideCompanion: React.FC<GuideCompanionProps> = ({
  visible,
  reducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  // Transition state
  const currentScale = useRef<number>(0);
  const blinkTimer = useRef<number>(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.getElapsedTime();
    const isMobile = state.size.width < 768;

    // Resting target position based on screen width
    // Sits gracefully in the upper-right or center-upper quadrant
    const targetX = isMobile ? 0 : 2.0;
    const targetY = isMobile ? 1.4 : 0.6;
    const targetZ = isMobile ? 2.5 : 2.4;

    // Entrance animation: smoothly scale and float into place
    const targetScale = visible ? 1 : 0;
    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      targetScale,
      reducedMotion ? 0.2 : 0.06
    );
    group.scale.setScalar(currentScale.current);

    if (currentScale.current < 0.005) {
      group.visible = false;
      return;
    }
    group.visible = true;

    // Gentle hover motion
    if (!reducedMotion) {
      const hoverOffset = Math.sin(time * 2.2) * 0.07;
      const swayOffset = Math.cos(time * 1.6) * 0.03;

      group.position.x = THREE.MathUtils.lerp(group.position.x, targetX + swayOffset, 0.06);
      group.position.y = THREE.MathUtils.lerp(group.position.y, targetY + hoverOffset, 0.06);
      group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, 0.06);

      // Subtle look-at orientation towards mouse pointer
      const lookTargetY = state.pointer.x * 0.45;
      const lookTargetX = -state.pointer.y * 0.35;
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, lookTargetY, 0.08);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, lookTargetX, 0.08);
      group.rotation.z = Math.sin(time * 1.2) * 0.04;

      // Precess orbital ring
      if (ringRef.current) {
        ringRef.current.rotation.x += delta * 0.8;
        ringRef.current.rotation.y += delta * 1.2;
      }

      // Cute periodic blinking
      blinkTimer.current += delta;
      const isBlinking = (blinkTimer.current % 4.5) > 4.35;
      const eyeScaleY = isBlinking ? 0.1 : 1.0;

      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, 0.3);
        rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, 0.3);
      }
    } else {
      // Static placement under reduced motion
      group.position.set(targetX, targetY, targetZ);
      group.rotation.set(0, 0, 0);
      if (ringRef.current) {
        ringRef.current.rotation.set(0.6, 0.4, 0);
      }
    }
  });

  return (
    <group ref={groupRef} position={[2.0, -2, 2.4]} scale={0}>
      {/* Central Luminous Companion Core */}
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#38bdf8"
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Visor Area */}
      <mesh position={[0, 0.02, 0.16]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#030712" />
      </mesh>

      {/* Cute Starlight Eyes */}
      <mesh ref={leftEyeRef} position={[-0.045, 0.03, 0.23]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>

      <mesh ref={rightEyeRef} position={[0.045, 0.03, 0.23]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>

      {/* Soft Ethereal Halo Aura */}
      <mesh>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Precessing Celestial Orbital Ring */}
      <mesh ref={ringRef} rotation={[0.6, 0.3, 0]}>
        <torusGeometry args={[0.36, 0.009, 12, 36]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#38bdf8"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Top Beacon Antenna */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.07, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
};
