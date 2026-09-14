import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DestinationTravelConfig } from '../../../types/travel';

interface WormholeHorizonProps {
  config: DestinationTravelConfig;
  opacity: number;
  exitFlash: number;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uExitFlash;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;

  varying vec2 vUv;

  void main() {
    vec2 center = vUv - vec2(0.5);
    float dist = length(center);

    if (dist > 0.5) {
      discard;
    }

    // Concentric gravitational lens rings
    float ring1 = smoothstep(0.04, 0.0, abs(dist - 0.22));
    float ring2 = smoothstep(0.03, 0.0, abs(dist - 0.35));
    float ring3 = smoothstep(0.02, 0.0, abs(dist - 0.44));
    float rings = (ring1 * 0.4 + ring2 * 0.3 + ring3 * 0.15);

    // Warm, soft central celestial disc
    float core = smoothstep(0.18, 0.0, dist);
    float halo = smoothstep(0.5, 0.05, dist);

    // Subtle breathing pulse
    float pulse = 0.90 + 0.10 * sin(uTime * 3.5);

    vec3 starlight = mix(uSecondaryColor, uPrimaryColor, core);

    // Normal travel starlight intensity
    float baseIntensity = (core * 0.85 + halo * 0.35 + rings * 0.30) * pulse * uOpacity;

    // Soft exit starlight flare during deceleration
    float flashIntensity = uExitFlash * (halo * 1.5 + core * 2.0);

    float finalAlpha = clamp(baseIntensity + flashIntensity, 0.0, 0.95);

    gl_FragColor = vec4(starlight, finalAlpha);
  }
`;

export const WormholeHorizon: React.FC<WormholeHorizonProps> = ({
  config,
  opacity,
  exitFlash,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uExitFlash: { value: exitFlash },
      uPrimaryColor: { value: new THREE.Color(config.primaryColor) },
      uSecondaryColor: { value: new THREE.Color(config.secondaryColor) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.primaryColor, config.secondaryColor]
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uOpacity.value = opacity;
    materialRef.current.uniforms.uExitFlash.value = exitFlash;
  });

  return (
    <mesh position={[0, 0, -38]}>
      <planeGeometry args={[16, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
