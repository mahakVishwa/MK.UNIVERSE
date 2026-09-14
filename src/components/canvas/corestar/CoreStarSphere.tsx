import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoreStarSphereProps {
  reducedMotion?: boolean;
  isDimmed?: boolean;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uReducedMotion;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Solar plasma surface ripple
    float disp = 0.0;
    if (uReducedMotion < 0.5) {
      disp = sin(position.x * 4.2 + uTime * 1.5)
           * cos(position.y * 4.2 + uTime * 1.2)
           * sin(position.z * 4.2 + uTime * 1.6) * 0.024;
    }

    vec3 deformed = position + normal * disp;
    vec4 mvPosition = modelViewMatrix * vec4(deformed, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uReducedMotion;
  uniform float uDim;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
                   mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                   mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 norm = normalize(vNormal);

    vec3 warmWhite = vec3(0.988, 0.973, 0.941); // #fcf8f0
    vec3 champagne = vec3(0.788, 0.718, 0.561); // #c9b78f
    vec3 goldenCore = vec3(0.910, 0.780, 0.520); // #e8c785
    vec3 deepDust = vec3(0.220, 0.180, 0.230);   // #382e3b

    float t = uReducedMotion < 0.5 ? uTime * 0.35 : 0.0;
    vec3 coord = vPosition * 2.2 + vec3(0.0, t * 0.2, t * 0.15);

    float n1 = noise(coord);
    float n2 = noise(coord * 2.4 - vec3(t * 0.3, 0.0, t * 0.2));
    float plasma = n1 * 0.65 + n2 * 0.35;

    vec3 surfaceColor = mix(goldenCore, warmWhite, plasma * 0.85);
    surfaceColor = mix(surfaceColor, deepDust, (1.0 - plasma) * 0.25);

    float NdotV = max(0.0, dot(norm, viewDir));
    float limb = pow(NdotV, 0.65);
    surfaceColor = mix(champagne * 0.85, surfaceColor, limb);

    float fresnel = pow(1.0 - NdotV, 2.4);
    vec3 finalColor = mix(surfaceColor, warmWhite, fresnel * 0.75);

    // Dimming: scales down surface brightness when an object is focused
    gl_FragColor = vec4(finalColor * uDim, 0.98);
  }
`;

export const CoreStarSphere: React.FC<CoreStarSphereProps> = ({
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

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const targetDim = isDimmed ? 0.12 : 1.0;
    dimValRef.current = THREE.MathUtils.lerp(
      dimValRef.current,
      targetDim,
      reducedMotion ? 0.25 : 0.05
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
      materialRef.current.uniforms.uDim.value = dimValRef.current;
    }
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Pure, Luminous Procedural Solar Plasma Sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
};

export default CoreStarSphere;
