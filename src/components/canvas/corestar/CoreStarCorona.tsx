import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoreStarCoronaProps {
  reducedMotion?: boolean;
  isDimmed?: boolean;
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
  uniform float uReducedMotion;
  uniform float uDim;

  varying vec2 vUv;

  void main() {
    vec2 center = vUv - vec2(0.5);
    float dist = length(center) * 2.0;

    if (dist > 1.0) {
      discard;
    }

    vec3 warmWhite = vec3(0.988, 0.973, 0.941); // #fcf8f0
    vec3 golden = vec3(0.910, 0.780, 0.520);    // #e8c785
    vec3 champagne = vec3(0.788, 0.718, 0.561); // #c9b78f

    float pulse = 1.0;
    if (uReducedMotion < 0.5) {
      pulse = 0.93 + 0.07 * sin(uTime * 1.4);
    }

    float innerGlow = smoothstep(0.70, 0.25, dist);
    float outerGlow = smoothstep(1.0, 0.35, dist);

    vec3 glowColor = mix(champagne, golden, innerGlow);
    glowColor = mix(glowColor, warmWhite, innerGlow * innerGlow);

    float alpha = (innerGlow * 0.55 + outerGlow * 0.35) * pulse * 0.70 * uDim;

    gl_FragColor = vec4(glowColor, alpha);
  }
`;

export const CoreStarCorona: React.FC<CoreStarCoronaProps> = ({
  reducedMotion = false,
  isDimmed = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dimValRef = useRef<number>(1.0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReducedMotion: { value: reducedMotion ? 1.0 : 0.0 },
      uDim: { value: 1.0 },
    }),
    [reducedMotion]
  );

  useFrame((state) => {
    const targetDim = isDimmed ? 0.04 : 1.0;
    dimValRef.current = THREE.MathUtils.lerp(
      dimValRef.current,
      targetDim,
      reducedMotion ? 0.25 : 0.05
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
      materialRef.current.uniforms.uDim.value = dimValRef.current;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[5.2, 5.2]} />
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
    </group>
  );
};

export default CoreStarCorona;
