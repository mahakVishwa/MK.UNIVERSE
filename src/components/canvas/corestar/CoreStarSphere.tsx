import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoreStarSphereProps {
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
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uDim;
  uniform float uPulseSpeed;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uTexture, uv);

    // Key out pure black background with smooth starlight threshold
    float brightness = max(tex.r, max(tex.g, tex.b));
    float alpha = smoothstep(0.03, 0.15, brightness);

    if (alpha < 0.005) discard;

    // Organic breathing pulse of solar energy
    float pulse = 0.92 + 0.08 * sin(uTime * uPulseSpeed);

    vec3 color = tex.rgb * pulse * uDim;
    gl_FragColor = vec4(color, alpha * uDim);
  }
`;

/**
 * CoreStarSphere: Richly illustrated anime-style celestial Sun.
 * Hand-painted Makoto Shinkai / Studio Ghibli cosmic fantasy aesthetic.
 * Layered with animated plasma swirls, solar prominences, and atmospheric golden corona glow.
 */
export const CoreStarSphere: React.FC<CoreStarSphereProps> = ({
  reducedMotion = false,
  isDimmed = false,
}) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const prominenceRef = useRef<THREE.Mesh>(null);
  const materialCoreRef = useRef<THREE.ShaderMaterial>(null);
  const materialProminenceRef = useRef<THREE.ShaderMaterial>(null);
  const dimValRef = useRef<number>(1.0);

  // Load hand-painted anime cosmic sun artwork
  const sunTexture = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/assets/corestar/sun.jpg');
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  const uniformsCore = useMemo(
    () => ({
      uTexture: { value: sunTexture },
      uTime: { value: 0 },
      uDim: { value: 1.0 },
      uPulseSpeed: { value: 1.4 },
    }),
    [sunTexture]
  );

  const uniformsProminences = useMemo(
    () => ({
      uTexture: { value: sunTexture },
      uTime: { value: 0 },
      uDim: { value: 1.0 },
      uPulseSpeed: { value: 2.1 },
    }),
    [sunTexture]
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Smooth dimming when an object is focused
    const targetDim = isDimmed ? 0.14 : 1.0;
    dimValRef.current = THREE.MathUtils.lerp(
      dimValRef.current,
      targetDim,
      reducedMotion ? 0.25 : 0.05
    );

    if (materialCoreRef.current) {
      materialCoreRef.current.uniforms.uTime.value = time;
      materialCoreRef.current.uniforms.uDim.value = dimValRef.current;
    }
    if (materialProminenceRef.current) {
      materialProminenceRef.current.uniforms.uTime.value = time;
      materialProminenceRef.current.uniforms.uDim.value = dimValRef.current;
    }

    if (!reducedMotion) {
      // Layer 1: Core clockwise solar rotation
      if (coreRef.current) {
        coreRef.current.rotation.z -= delta * 0.025;
      }
      // Layer 2: Prominences counter-rotation and breathing
      if (prominenceRef.current) {
        prominenceRef.current.rotation.z += delta * 0.015;
        const flareScale = 1.08 + Math.sin(time * 1.8) * 0.03;
        prominenceRef.current.scale.set(flareScale, flareScale, 1.0);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Layer 1: Richly Illustrated Core Plasma Sun (Size: 4.8 x 4.8) */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <planeGeometry args={[4.8, 4.8]} />
        <shaderMaterial
          ref={materialCoreRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniformsCore}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Layer 2: Swirling Anime Solar Prominences & Tendril Flares */}
      <mesh ref={prominenceRef} position={[0, 0, 0.04]} scale={[1.08, 1.08, 1]}>
        <planeGeometry args={[4.8, 4.8]} />
        <shaderMaterial
          ref={materialProminenceRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniformsProminences}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default CoreStarSphere;
