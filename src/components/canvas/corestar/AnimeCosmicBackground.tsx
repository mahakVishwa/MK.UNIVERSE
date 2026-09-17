import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AnimeCosmicBackgroundProps {
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
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    // Deep atmospheric anime cosmic tint with smooth dimming
    vec3 color = tex.rgb * uDim;
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * AnimeCosmicBackground: Richly painted anime cosmic nebula sky in the aesthetic
 * of Makoto Shinkai and Studio Ghibli. Creates 2.5D deep space background with gentle parallax.
 */
export const AnimeCosmicBackground: React.FC<AnimeCosmicBackgroundProps> = ({
  reducedMotion = false,
  isDimmed = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dimValRef = useRef<number>(1.0);

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/assets/corestar/nebula.jpg');
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uDim: { value: 1.0 },
    }),
    [texture]
  );

  useFrame((state) => {
    const targetDim = isDimmed ? 0.35 : 1.0;
    dimValRef.current = THREE.MathUtils.lerp(
      dimValRef.current,
      targetDim,
      reducedMotion ? 0.25 : 0.04
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uDim.value = dimValRef.current;
    }

    if (meshRef.current && !reducedMotion) {
      // Subtle 2.5D camera parallax
      const targetX = state.pointer.x * 0.45;
      const targetY = state.pointer.y * 0.25;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.03);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.03);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      {/* Expansive 16:9 painted anime sky background */}
      <planeGeometry args={[26, 15]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

export default AnimeCosmicBackground;
