import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DestinationTravelConfig } from '../../../types/travel';

interface WormholeStreaksProps {
  config: DestinationTravelConfig;
  speed: number;
  stretch: number;
  progress: number;
  twist: number;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uStretch;
  uniform float uTwist;
  uniform float uProgress;

  attribute float aIsTail;
  attribute float aRadius;
  attribute float aAngle;
  attribute float aSpeedMult;
  attribute float aSeed;
  attribute float aBaseLength;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    // Continuous travel along the Z-axis toward the camera
    float tunnelSpan = 65.0;
    // Travel speed scales dynamically from quiet drift to warp velocity
    float velocity = (12.0 + uSpeed * 34.0) * aSpeedMult;
    float zHead = mod(aSeed * tunnelSpan - uTime * velocity, tunnelSpan) - 45.0;

    // Tail stretches backward behind head proportional to uStretch
    float streakLen = aBaseLength * (0.15 + uStretch * 7.5);
    float currentZ = zHead + (aIsTail * streakLen);

    // Subtle gravitational swirl / spacetime bending
    float bendAngle = aAngle + (currentZ * 0.038 * uTwist) + (sin(currentZ * 0.14 + uTime * 2.5) * 0.07 * uTwist);

    // Spacetime throat pinch near the center of the wormhole
    float throatPinch = 0.76 + 0.24 * smoothstep(0.0, 18.0, abs(currentZ));
    float r = aRadius * throatPinch;

    vec3 pos = vec3(r * cos(bendAngle), r * sin(bendAngle), currentZ);

    // Head is bright and crisp; tail dissolves into the cosmic void
    float headAlpha = 0.95;
    float tailAlpha = 0.06;
    float streakFade = mix(headAlpha, tailAlpha, aIsTail);

    // Smooth depth fade at far entrance (-45) and behind camera (+8)
    float depthFade = smoothstep(-45.0, -36.0, currentZ) * (1.0 - smoothstep(4.0, 14.0, currentZ));

    vAlpha = streakFade * depthFade * uProgress;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.005) {
      discard;
    }
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

export const WormholeStreaks: React.FC<WormholeStreaksProps> = ({
  config,
  speed,
  stretch,
  progress,
  twist,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate procedural star filament coordinates and attributes
  const { geometry } = useMemo(() => {
    const count = config.streakCount;
    const vertexCount = count * 2;

    const positions = new Float32Array(vertexCount * 3);
    const isTail = new Float32Array(vertexCount);
    const radius = new Float32Array(vertexCount);
    const angle = new Float32Array(vertexCount);
    const speedMult = new Float32Array(vertexCount);
    const seed = new Float32Array(vertexCount);
    const baseLength = new Float32Array(vertexCount);
    const colors = new Float32Array(vertexCount * 3);

    const primaryCol = new THREE.Color(config.primaryColor);
    const secondaryCol = new THREE.Color(config.secondaryColor);
    const accentCol = new THREE.Color(config.accentColor);

    for (let i = 0; i < count; i++) {
      const idx0 = i * 2;
      const idx1 = idx0 + 1;

      // Distribute stars in cylindrical shell surrounding the travel corridor
      // Denser near inner boundary, feathered outward
      const r = 0.5 + Math.pow(Math.random(), 1.4) * config.tunnelRadius * 1.3;
      const theta = Math.random() * Math.PI * 2;
      const sMult = 0.75 + Math.random() * 0.5;
      const sSeed = Math.random();
      const bLen = 0.6 + Math.random() * 1.4;

      // Color variation across the restrained warm celestial palette
      const colorRoll = Math.random();
      let starCol: THREE.Color;
      if (colorRoll < 0.60) {
        starCol = primaryCol.clone().lerp(secondaryCol, Math.random() * 0.4);
      } else if (colorRoll < 0.88) {
        starCol = secondaryCol.clone().lerp(primaryCol, Math.random() * 0.3);
      } else {
        starCol = accentCol.clone().lerp(secondaryCol, Math.random() * 0.5);
      }

      // Head vertex
      isTail[idx0] = 0.0;
      radius[idx0] = r;
      angle[idx0] = theta;
      speedMult[idx0] = sMult;
      seed[idx0] = sSeed;
      baseLength[idx0] = bLen;
      colors[idx0 * 3] = starCol.r;
      colors[idx0 * 3 + 1] = starCol.g;
      colors[idx0 * 3 + 2] = starCol.b;

      // Tail vertex
      isTail[idx1] = 1.0;
      radius[idx1] = r;
      angle[idx1] = theta;
      speedMult[idx1] = sMult;
      seed[idx1] = sSeed;
      baseLength[idx1] = bLen;
      colors[idx1 * 3] = starCol.r * 0.9;
      colors[idx1 * 3 + 1] = starCol.g * 0.9;
      colors[idx1 * 3 + 2] = starCol.b * 0.9;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aIsTail', new THREE.BufferAttribute(isTail, 1));
    geo.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1));
    geo.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1));
    geo.setAttribute('aSpeedMult', new THREE.BufferAttribute(speedMult, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.setAttribute('aBaseLength', new THREE.BufferAttribute(baseLength, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    return { geometry: geo };
  }, [config]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uStretch: { value: stretch },
      uTwist: { value: twist },
      uProgress: { value: progress },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uSpeed.value = speed;
    materialRef.current.uniforms.uStretch.value = stretch;
    materialRef.current.uniforms.uTwist.value = twist;
    materialRef.current.uniforms.uProgress.value = progress;
  });

  return (
    <lineSegments geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};
