import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_GALAXY_CONFIG, GalaxyConfig } from './galaxyConfig';

interface ArrivalGalaxyProps {
  reducedMotion?: boolean;
  onGalaxyFormed?: () => void;
  config?: GalaxyConfig;
  warmthBoost?: boolean;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform vec3 uMouseWorld;
  uniform float uMouseIntensity;
  uniform float uReducedMotion;

  attribute vec3 aInitialPosition;
  attribute vec3 aTargetPosition;
  attribute float aRandomSeed;
  attribute float aSize;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    // Staggered individual particle formation progress
    float staggerDelay = aRandomSeed * 0.32;
    float localProgress = clamp((uProgress - staggerDelay) / (1.0 - 0.32), 0.0, 1.0);
    float t = smoothstep(0.0, 1.0, localProgress);

    // Initial scattered position vs target spiral position
    vec3 initialPos = aInitialPosition;
    vec3 targetPos = aTargetPosition;

    // Cosmic spiral swirl during formation
    float swirlAngle = (1.0 - t) * 3.4 * (1.0 - clamp(length(targetPos.xz) / 6.0, 0.0, 1.0));
    float cosA = cos(swirlAngle);
    float sinA = sin(swirlAngle);
    vec3 swirledTarget = vec3(
      targetPos.x * cosA - targetPos.z * sinA,
      targetPos.y,
      targetPos.x * sinA + targetPos.z * cosA
    );

    vec3 currentPos = mix(initialPos, swirledTarget, t);

    // Gentle gravitational pointer interaction
    if (uMouseIntensity > 0.001) {
      float d = distance(currentPos, uMouseWorld);
      float influenceRadius = 2.2;
      if (d < influenceRadius) {
        float factor = 1.0 - (d / influenceRadius);
        float force = factor * factor * uMouseIntensity;
        
        vec3 toMouse = normalize(uMouseWorld - currentPos);
        vec3 orbitTangent = normalize(cross(toMouse, vec3(0.0, 1.0, 0.0)));
        currentPos += (toMouse * 0.22 + orbitTangent * 0.30) * force;
      }
    }

    // Soft starlight twinkle
    float twinkle = 1.0;
    if (uReducedMotion < 0.5) {
      twinkle = 0.88 + 0.12 * sin(uTime * 1.8 + aRandomSeed * 40.0);
    }

    // Emergence from the void: particles fade in softly
    vAlpha = smoothstep(0.02, 0.25, localProgress) * twinkle;

    // View & Projection transform
    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Distance attenuation for particle scale
    gl_PointSize = (aSize * uSize * twinkle) * (1.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 75.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uCoreLuminanceCap;
  uniform float uWarmth;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    // Soft, delicate starlight disc with gentle feathering
    float core = smoothstep(0.12, 0.0, dist);
    float halo = smoothstep(0.5, 0.0, dist);
    float intensity = halo * 0.40 + core * 0.60;

    // Warm ivory stellar core mix without additive blowout
    vec3 baseColor = mix(vColor, vec3(0.96, 0.93, 0.87), core * uCoreLuminanceCap);

    // Subtly brighten & warm spiral arm stardust when companion is active
    vec3 warmArmTint = vec3(1.08, 0.98, 0.88);
    vec3 finalColor = mix(baseColor, baseColor * warmArmTint, uWarmth * 0.45);

    gl_FragColor = vec4(finalColor, intensity * vAlpha * (0.90 + uWarmth * 0.15));
  }
`;

export const ArrivalGalaxy: React.FC<ArrivalGalaxyProps> = ({
  reducedMotion = false,
  onGalaxyFormed,
  config = DEFAULT_GALAXY_CONFIG,
  warmthBoost = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Track progress and notification state
  const progressRef = useRef<number>(reducedMotion ? 1.0 : 0.0);
  const notifiedRef = useRef<boolean>(false);
  const currentMouseWorld = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetMouseWorld = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (reducedMotion) {
      progressRef.current = 1.0;
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onGalaxyFormed?.();
      }
    }
  }, [reducedMotion, onGalaxyFormed]);

  // Generate procedural star particle attributes with dreamy palette & dimmer core
  const { geometry } = useMemo(() => {
    const {
      particleCount,
      galaxyRadius,
      arms,
      armWinding,
      power,
      coreRadius,
      coreParticleScale,
      discThickness,
      randomness,
      coreColor: coreColorHex,
      armColor: armColorHex,
      haloColor: haloColorHex,
    } = config;

    const initialPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const randomSeeds = new Float32Array(particleCount);

    const coreColor = new THREE.Color(coreColorHex);    // #F3EBDD (warm star-white)
    const armColor = new THREE.Color(armColorHex);      // #C9B78F (faint champagne)
    const midArmRose = new THREE.Color('#6F555E');       // #6F555E (dusty rose starlight)
    const haloColor = new THREE.Color(haloColorHex);    // #29283A (smoky indigo)

    for (let i = 0; i < particleCount; i++) {
      const seed = Math.random();
      randomSeeds[i] = seed;

      // 1. Initial Void / Pre-galaxy scattered positions
      const initRadius = 0.5 + Math.random() * 7.5;
      const initTheta = Math.random() * Math.PI * 2;
      const initPhi = Math.acos(2 * Math.random() - 1);
      initialPositions[i * 3] = initRadius * Math.sin(initPhi) * Math.cos(initTheta);
      initialPositions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      initialPositions[i * 3 + 2] = initRadius * Math.cos(initPhi);

      // 2. Spiral Galaxy Target Positions (with negative space at center)
      const rawNorm = Math.pow(Math.random(), power);
      // Ensure central stars are comfortably spaced rather than clustered into a single knot
      const r = (rawNorm * (galaxyRadius - coreRadius * 0.45)) + (Math.random() * coreRadius * 0.35);
      const isNearCore = r < coreRadius * 1.5;

      const armIndex = i % arms;
      const armAngle = (armIndex * 2 * Math.PI) / arms;
      const spiralCurvature = r * armWinding;

      const dispersionFactor = (r / galaxyRadius + 0.20) * randomness;
      const randomAngle = (Math.random() - 0.5) * dispersionFactor;
      const randomRadius = (Math.random() - 0.5) * 0.35 * (r / galaxyRadius + 0.1);

      // Disc vertical thickness: subtle center depth, thin wafer disc
      const coreBulge = Math.exp(-r / (galaxyRadius * 0.28));
      const height = (Math.random() - 0.5) * discThickness * (coreBulge * 1.1 + 0.16);

      const finalAngle = armAngle + spiralCurvature + randomAngle;
      const finalRadius = r + randomRadius;

      targetPositions[i * 3] = Math.cos(finalAngle) * finalRadius;
      targetPositions[i * 3 + 1] = height;
      targetPositions[i * 3 + 2] = Math.sin(finalAngle) * finalRadius;

      // 3. Starlight Color Distribution (Dreamy cosmic spectrum)
      const distRatio = Math.min(r / (galaxyRadius * 0.85), 1.0);
      let starColor: THREE.Color;

      if (distRatio < 0.28) {
        // Quiet starlight center: warm star-white to faint champagne
        const t = distRatio / 0.28;
        starColor = coreColor.clone().lerp(armColor, t);
      } else if (distRatio < 0.65) {
        // Spiral arms: faint champagne to dusty rose
        const t = (distRatio - 0.28) / 0.37;
        starColor = armColor.clone().lerp(midArmRose, t * 0.7);
      } else {
        // Outer rim dust: dusty rose to smoky indigo
        const t = (distRatio - 0.65) / 0.35;
        starColor = midArmRose.clone().lerp(haloColor, t * 0.8);
      }

      // Soft luminance jitter: subdued starlight feel
      const luminanceJitter = (isNearCore ? 0.65 : 0.75) + Math.random() * 0.25;
      colors[i * 3] = starColor.r * luminanceJitter;
      colors[i * 3 + 1] = starColor.g * luminanceJitter;
      colors[i * 3 + 2] = starColor.b * luminanceJitter;

      // 4. Particle Sizes: fine stardust pinpoints at center
      const coreScale = isNearCore ? coreParticleScale : 1.0;
      const sizeVariation = (0.50 + Math.random() * 0.60) * coreScale;
      sizes[i] = sizeVariation;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(targetPositions, 3));
    geo.setAttribute('aInitialPosition', new THREE.BufferAttribute(initialPositions, 3));
    geo.setAttribute('aTargetPosition', new THREE.BufferAttribute(targetPositions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aRandomSeed', new THREE.BufferAttribute(randomSeeds, 1));

    return { geometry: geo };
  }, [config]);

  // Shader Uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: reducedMotion ? 1.0 : 0.0 },
      uSize: { value: config.particleSize },
      uCoreLuminanceCap: { value: config.coreLuminanceCap },
      uWarmth: { value: warmthBoost ? 1.0 : 0.0 },
      uMouseWorld: { value: new THREE.Vector3(0, 0, 0) },
      uMouseIntensity: { value: 0.0 },
      uReducedMotion: { value: reducedMotion ? 1.0 : 0.0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.particleSize, config.coreLuminanceCap]
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
    }
  }, [reducedMotion]);

  // Frame Loop
  useFrame((state, delta) => {
    const mat = materialRef.current;
    const group = groupRef.current;
    if (!mat) return;

    mat.uniforms.uTime.value = state.clock.getElapsedTime();

    // Smoothly blend warmth boost when companion is active/speaking
    const targetWarmth = warmthBoost ? 1.0 : 0.0;
    mat.uniforms.uWarmth.value = THREE.MathUtils.lerp(
      mat.uniforms.uWarmth.value,
      targetWarmth,
      0.04
    );

    // Formation sequence progression
    if (!reducedMotion && progressRef.current < 1.0) {
      progressRef.current = Math.min(
        progressRef.current + delta / config.arrivalDuration,
        1.0
      );
      mat.uniforms.uProgress.value = progressRef.current;

      if (
        progressRef.current >= config.textRevealThreshold &&
        !notifiedRef.current
      ) {
        notifiedRef.current = true;
        onGalaxyFormed?.();
      }
    } else if (reducedMotion) {
      mat.uniforms.uProgress.value = 1.0;
    }

    // Galaxy Celestial Rotation & Tilt
    if (group) {
      if (!reducedMotion) {
        group.rotation.y += delta * config.rotationSpeed;

        const targetTiltX = 0.40 - state.pointer.y * 0.08;
        const targetTiltZ = -0.12 + state.pointer.x * 0.07;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetTiltX, 0.03);
        group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetTiltZ, 0.03);
      } else {
        group.rotation.x = 0.40;
        group.rotation.z = -0.12;
      }
    }

    // Pointer Gravitational Influence
    if (!reducedMotion && progressRef.current > 0.4) {
      targetMouseWorld.current.set(
        (state.pointer.x * viewport.width) * 0.40,
        0,
        (-state.pointer.y * viewport.height) * 0.40
      );

      currentMouseWorld.current.lerp(targetMouseWorld.current, 0.04);
      mat.uniforms.uMouseWorld.value.copy(currentMouseWorld.current);

      mat.uniforms.uMouseIntensity.value = THREE.MathUtils.lerp(
        mat.uniforms.uMouseIntensity.value,
        0.85,
        0.04
      );
    } else {
      mat.uniforms.uMouseIntensity.value = 0.0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.40, 0, -0.12]}>
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
