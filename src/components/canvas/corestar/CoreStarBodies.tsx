import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AboutObjectId, useCoreStarState } from './coreStarState';

interface CoreStarBodiesProps {
  reducedMotion?: boolean;
}

interface CelestialIllustratedConfig {
  id: NonNullable<AboutObjectId>;
  heading: string;
  texturePath: string;
  basePos: [number, number, number];
  size: [number, number];
}

const BODIES_CONFIG: readonly CelestialIllustratedConfig[] = [
  {
    id: 'orbit',
    heading: 'CURRENT ORBIT',
    texturePath: '/assets/corestar/orbit.jpg',
    basePos: [-6.15, -0.50, 0.35],
    size: [2.1, 2.1],
  },
  {
    id: 'experience',
    heading: 'EXPERIENCE',
    texturePath: '/assets/corestar/experience.jpg',
    basePos: [-4.80, 1.20, 0.25],
    size: [2.05, 2.05],
  },
  {
    id: 'interests',
    heading: 'INTERESTS',
    texturePath: '/assets/corestar/interests.jpg',
    basePos: [-3.40, -1.25, 0.30],
    size: [2.0, 2.0],
  },
  {
    id: 'education',
    heading: 'EDUCATION',
    texturePath: '/assets/corestar/education.jpg',
    basePos: [-2.10, 1.35, 0.35],
    size: [2.05, 2.05],
  },
  {
    id: 'skills',
    heading: 'SKILLS',
    texturePath: '/assets/corestar/skills.jpg',
    basePos: [-1.30, -1.50, 0.40],
    size: [2.1, 2.1],
  },
] as const;

const spriteVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const spriteFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uDim;
  uniform float uSelected;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);

    // Key out black background cleanly with smooth starlight feathering
    float brightness = max(tex.r, max(tex.g, tex.b));
    float alpha = smoothstep(0.04, 0.16, brightness);

    if (alpha < 0.005) discard;

    // Gentle breathing starlight shimmer
    float pulse = 0.94 + 0.06 * sin(uTime * 1.6);
    float glowBoost = uSelected > 0.5 ? 1.15 : 1.0;

    vec3 color = tex.rgb * pulse * uDim * glowBoost;
    gl_FragColor = vec4(color, alpha * uDim);
  }
`;

/**
 * CoreStarBodies: Renders the 5 celestial objects as richly detailed hand-painted anime fantasy artwork.
 * Each object possesses a unique illustrated silhouette, ornate textures, and 2.5D zero-G drift.
 */
export const CoreStarBodies: React.FC<CoreStarBodiesProps> = ({ reducedMotion = false }) => {
  const [selectedId, setSelectedId] = useCoreStarState();

  const orbRef = useRef<THREE.Group>(null);
  const expRef = useRef<THREE.Group>(null);
  const intRef = useRef<THREE.Group>(null);
  const eduRef = useRef<THREE.Group>(null);
  const sklRef = useRef<THREE.Group>(null);

  const groupRefs: Record<NonNullable<AboutObjectId>, React.RefObject<THREE.Group | null>> = {
    orbit: orbRef,
    experience: expRef,
    interests: intRef,
    education: eduRef,
    skills: sklRef,
  };

  // Load hand-painted anime fantasy illustrations for each celestial object
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const map: Record<string, THREE.Texture> = {};
    BODIES_CONFIG.forEach((cfg) => {
      const tex = loader.load(cfg.texturePath);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      map[cfg.id] = tex;
    });
    return map;
  }, []);

  const materials = useMemo(() => {
    const map: Record<string, THREE.ShaderMaterial> = {};
    BODIES_CONFIG.forEach((cfg) => {
      map[cfg.id] = new THREE.ShaderMaterial({
        vertexShader: spriteVertexShader,
        fragmentShader: spriteFragmentShader,
        uniforms: {
          uTexture: { value: textures[cfg.id] },
          uTime: { value: 0 },
          uDim: { value: 1.0 },
          uSelected: { value: 0.0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
    });
    return map;
  }, [textures]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    BODIES_CONFIG.forEach((config) => {
      const group = groupRefs[config.id].current;
      const mat = materials[config.id];
      if (!group || !mat) return;

      const isSelected = selectedId === config.id;
      const isAnySelected = selectedId !== null;

      let targetX: number;
      let targetY: number;
      let targetZ: number;
      let targetScale: number;

      if (isSelected) {
        if (config.id === 'skills') {
          // Skills animation glides towards far-right
          targetX = 0.45;
          targetY = -0.15;
          targetZ = 2.40;
          targetScale = reducedMotion ? 1.6 : 2.15;
        } else {
          // Other celestial bodies glide to left-center foreground
          targetX = -3.75;
          targetY = 0.05;
          targetZ = 2.65;
          targetScale = reducedMotion ? 1.6 : 2.2;
        }
      } else if (isAnySelected) {
        // Deeply recede and shrink into background void
        const [bx, by, bz] = config.basePos;
        targetX = bx * 1.05;
        targetY = by * 1.05;
        targetZ = bz - 1.5;
        targetScale = 0.20;
      } else {
        // Natural resting orbital position with gentle 2.5D zero-G float
        const [bx, by, bz] = config.basePos;
        const driftX = reducedMotion ? 0 : Math.sin(time * 0.35 + bz * 2.5) * 0.08;
        const driftY = reducedMotion ? 0 : Math.cos(time * 0.30 + bx) * 0.08;
        targetX = bx + driftX;
        targetY = by + driftY;
        targetZ = bz;
        targetScale = 1.0;
      }

      const lerpSpeed = reducedMotion ? 0.25 : 0.055;
      group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, lerpSpeed);
      group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, lerpSpeed);
      group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, lerpSpeed);

      const currentS = group.scale.x;
      const s = THREE.MathUtils.lerp(currentS, targetScale, lerpSpeed);
      group.scale.setScalar(s);

      // Subtle atmospheric rotation
      if (!reducedMotion) {
        if (config.id === 'orbit') {
          group.rotation.z += delta * 0.012;
        } else if (config.id === 'experience') {
          group.rotation.z -= delta * 0.008;
        } else if (config.id === 'interests') {
          group.rotation.z += delta * 0.018;
        } else if (config.id === 'education') {
          group.rotation.z -= delta * 0.010;
        } else if (config.id === 'skills') {
          group.rotation.z += delta * 0.015;
        }
      }

      // Dimming control: Selected object stays at 1.0, non-selected dim to 0.06
      const targetDim = isSelected ? 1.0 : isAnySelected ? 0.06 : 1.0;
      mat.uniforms.uTime.value = time;
      mat.uniforms.uSelected.value = isSelected ? 1.0 : 0.0;
      mat.uniforms.uDim.value = THREE.MathUtils.lerp(
        mat.uniforms.uDim.value,
        targetDim,
        0.06
      );
    });
  });

  const handleSelect = (id: NonNullable<AboutObjectId>) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const isDimmed = selectedId !== null;

  return (
    <group>
      {BODIES_CONFIG.map((cfg) => {
        const ref = groupRefs[cfg.id];
        const mat = materials[cfg.id];

        return (
          <group
            key={cfg.id}
            ref={ref}
            position={cfg.basePos}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(cfg.id);
            }}
          >
            {/* Rich Hand-Painted Anime Celestial Artwork Mesh */}
            <mesh>
              <planeGeometry args={cfg.size} />
              <primitive object={mat} attach="material" />
            </mesh>

            {/* Delicate Hand-Crafted Starlight Label (Hidden when any object is focused) */}
            {!isDimmed && (
              <Html
                position={[0, -cfg.size[1] * 0.52 - 0.12, 0]}
                center
                distanceFactor={7}
                className="select-none pointer-events-auto"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(cfg.id);
                  }}
                  aria-label={`${cfg.heading} celestial object`}
                  className="cursor-pointer select-none py-0.5 px-1 focus:outline-none group flex flex-col items-center"
                >
                  <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.35em] text-[#c9b78f]/85 group-hover:text-[#ffffff] group-hover:tracking-[0.42em] transition-all duration-300 uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    {cfg.heading}
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default CoreStarBodies;
