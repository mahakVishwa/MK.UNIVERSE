import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AboutObjectId, useCoreStarState } from './coreStarState';

interface CoreStarBodiesProps {
  reducedMotion?: boolean;
}

interface CelestialBodyConfig {
  id: NonNullable<AboutObjectId>;
  heading: string;
  radius: number;
  basePos: [number, number, number];
}

// 5 celestial bodies scattered horizontally across the entire screen
// (Parent group CoreStarEnvironment is at baseX = 2.45)
// World X: Current Orbit (-3.70) -> Experience (-2.35) -> Interests (-0.95) -> Education (+0.35) -> Skills (+1.15) -> Sun (+2.45)
const BODIES_CONFIG: readonly CelestialBodyConfig[] = [
  {
    id: 'orbit',
    heading: 'CURRENT ORBIT',
    radius: 6.15,
    basePos: [-6.15, -0.50, 0.35],
  },
  {
    id: 'experience',
    heading: 'EXPERIENCE',
    radius: 4.80,
    basePos: [-4.80, 1.20, 0.25],
  },
  {
    id: 'interests',
    heading: 'INTERESTS',
    radius: 3.40,
    basePos: [-3.40, -1.25, 0.30],
  },
  {
    id: 'education',
    heading: 'EDUCATION',
    radius: 2.10,
    basePos: [-2.10, 1.35, 0.35],
  },
  {
    id: 'skills',
    heading: 'SKILLS',
    radius: 1.30,
    basePos: [-1.30, -1.50, 0.40],
  },
] as const;

export const CoreStarBodies: React.FC<CoreStarBodiesProps> = ({ reducedMotion = false }) => {
  const [selectedId, setSelectedId] = useCoreStarState();

  const eduRef = useRef<THREE.Group>(null);
  const intRef = useRef<THREE.Group>(null);
  const expRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Group>(null);
  const sklRef = useRef<THREE.Group>(null);

  const moon1Ref = useRef<THREE.Mesh>(null);
  const moon2Ref = useRef<THREE.Mesh>(null);
  const moon3Ref = useRef<THREE.Mesh>(null);
  const moon4Ref = useRef<THREE.Mesh>(null);

  const groupRefs: Record<NonNullable<AboutObjectId>, React.RefObject<THREE.Group | null>> = {
    orbit: orbRef,
    experience: expRef,
    interests: intRef,
    education: eduRef,
    skills: sklRef,
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    BODIES_CONFIG.forEach((config) => {
      const group = groupRefs[config.id].current;
      if (!group) return;

      const isSelected = selectedId === config.id;
      const isAnySelected = selectedId !== null;

      let targetX: number;
      let targetY: number;
      let targetZ: number;
      let targetScale: number;

      if (isSelected) {
        if (config.id === 'skills') {
          // Skills animation goes towards far-right when clicked
          targetX = 0.45;
          targetY = -0.15;
          targetZ = 2.30;
          targetScale = reducedMotion ? 1.6 : 2.05;
        } else {
          // Other 4 bodies go to Left-Center foreground (world x = -1.30)
          targetX = -3.75;
          targetY = 0.05;
          targetZ = 2.60;
          targetScale = reducedMotion ? 1.6 : 2.1;
        }
      } else if (isAnySelected) {
        // Deeply recede and shrink into the background void
        const [bx, by, bz] = config.basePos;
        targetX = bx * 1.05;
        targetY = by * 1.05;
        targetZ = bz - 1.5;
        targetScale = 0.20;
      } else {
        // Natural resting orbital position with gentle orbital drift
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

      // Independent rotational motion
      if (!reducedMotion) {
        if (config.id === 'education') {
          group.rotation.y += delta * 0.35;
          group.rotation.x += delta * 0.18;
        } else if (config.id === 'interests') {
          group.rotation.y -= delta * 0.25;
        } else if (config.id === 'experience') {
          group.rotation.y += delta * 0.14;
          group.rotation.z += delta * 0.08;
        } else if (config.id === 'orbit') {
          group.rotation.y += delta * 0.45;
        } else if (config.id === 'skills') {
          group.rotation.y += delta * 0.22;
        }
      }
    });

    // Skills mini planetary system satellites
    if (!reducedMotion) {
      if (moon1Ref.current) {
        const a1 = time * 1.5;
        moon1Ref.current.position.set(Math.cos(a1) * 0.48, Math.sin(a1 * 0.8) * 0.14, Math.sin(a1) * 0.48);
      }
      if (moon2Ref.current) {
        const a2 = time * 1.1 + 1.6;
        moon2Ref.current.position.set(Math.cos(a2) * 0.68, Math.sin(a2 * 0.9) * 0.16, Math.sin(a2) * 0.68);
      }
      if (moon3Ref.current) {
        const a3 = time * 0.85 + 3.2;
        moon3Ref.current.position.set(Math.cos(a3) * 0.88, Math.sin(a3 * 0.7) * 0.19, Math.sin(a3) * 0.88);
      }
      if (moon4Ref.current) {
        const a4 = time * 0.65 + 4.8;
        moon4Ref.current.position.set(Math.cos(a4) * 1.10, Math.sin(a4 * 0.6) * 0.22, Math.sin(a4) * 1.10);
      }
    }
  });

  const handleSelect = (id: NonNullable<AboutObjectId>) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const isDimmed = selectedId !== null;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. CURRENT ORBIT: Ringed Satellite Moon (Far Left)           */}
      {/* ============================================================ */}
      <group
        ref={orbRef}
        position={BODIES_CONFIG[0].basePos}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect('orbit');
        }}
      >
        <mesh>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color="#c9b78f"
            emissive="#a38b59"
            emissiveIntensity={selectedId === 'orbit' ? 1.5 : isDimmed ? 0.02 : 0.45}
            roughness={0.25}
          />
        </mesh>
        <mesh rotation={[1.1, 0.4, 0]}>
          <ringGeometry args={[0.30, 0.44, 36]} />
          <meshBasicMaterial
            color="#e8c785"
            transparent={true}
            opacity={selectedId === 'orbit' ? 0.9 : isDimmed ? 0.05 : 0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Dedicated bright focus light when selected */}
        <pointLight
          color="#fcf8f0"
          intensity={selectedId === 'orbit' ? 4.5 : isDimmed ? 0.0 : 0.5}
          distance={5}
          decay={2}
        />
        {(!isDimmed || selectedId === 'orbit') && (
          <Html
            position={[0, -0.42, 0]}
            center
            distanceFactor={7}
            className="select-none pointer-events-auto"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('orbit');
              }}
              aria-label="Current orbit celestial object"
              className="cursor-pointer select-none py-0.5 px-1 focus:outline-none group flex flex-col items-center"
            >
              <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.32em] text-[#c9b78f]/75 group-hover:text-[#ffffff] group-hover:tracking-[0.40em] transition-all duration-300 uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                CURRENT ORBIT
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* ============================================================ */}
      {/* 2. EXPERIENCE: Cratered Bronze Asteroid Moon (Mid-Left)       */}
      {/* ============================================================ */}
      <group
        ref={expRef}
        position={BODIES_CONFIG[1].basePos}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect('experience');
        }}
      >
        <mesh>
          <dodecahedronGeometry args={[0.25, 1]} />
          <meshStandardMaterial
            color="#8c7b58"
            emissive="#5a454d"
            emissiveIntensity={selectedId === 'experience' ? 1.4 : isDimmed ? 0.02 : 0.35}
            roughness={0.7}
            metalness={0.3}
            flatShading={true}
          />
        </mesh>
        <pointLight
          color="#c9b78f"
          intensity={selectedId === 'experience' ? 4.5 : isDimmed ? 0.0 : 0.5}
          distance={5}
          decay={2}
        />
        {(!isDimmed || selectedId === 'experience') && (
          <Html
            position={[0, -0.40, 0]}
            center
            distanceFactor={7}
            className="select-none pointer-events-auto"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('experience');
              }}
              aria-label="Experience celestial object"
              className="cursor-pointer select-none py-0.5 px-1 focus:outline-none group flex flex-col items-center"
            >
              <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.32em] text-[#c9b78f]/75 group-hover:text-[#ffffff] group-hover:tracking-[0.40em] transition-all duration-300 uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                EXPERIENCE
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* ============================================================ */}
      {/* 3. INTERESTS: Glowing Amber Comet Core (Center-Left)         */}
      {/* ============================================================ */}
      <group
        ref={intRef}
        position={BODIES_CONFIG[2].basePos}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect('interests');
        }}
      >
        <mesh>
          <icosahedronGeometry args={[0.24, 2]} />
          <meshStandardMaterial
            color="#e8c785"
            emissive="#d49b38"
            emissiveIntensity={selectedId === 'interests' ? 1.6 : isDimmed ? 0.02 : 0.65}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
        <pointLight
          color="#e8c785"
          intensity={selectedId === 'interests' ? 4.5 : isDimmed ? 0.0 : 0.7}
          distance={5}
          decay={2}
        />
        {(!isDimmed || selectedId === 'interests') && (
          <Html
            position={[0, -0.38, 0]}
            center
            distanceFactor={7}
            className="select-none pointer-events-auto"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('interests');
              }}
              aria-label="Interests celestial object"
              className="cursor-pointer select-none py-0.5 px-1 focus:outline-none group flex flex-col items-center"
            >
              <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.32em] text-[#c9b78f]/75 group-hover:text-[#ffffff] group-hover:tracking-[0.40em] transition-all duration-300 uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                INTERESTS
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* ============================================================ */}
      {/* 4. EDUCATION: Faceted Crystal Octahedron Prism (Center)      */}
      {/* ============================================================ */}
      <group
        ref={eduRef}
        position={BODIES_CONFIG[3].basePos}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect('education');
        }}
      >
        <mesh>
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial
            color="#fcf8f0"
            emissive="#c9b78f"
            emissiveIntensity={selectedId === 'education' ? 1.6 : isDimmed ? 0.02 : 0.5}
            roughness={0.1}
            metalness={0.2}
            flatShading={true}
          />
        </mesh>
        <pointLight
          color="#fcf8f0"
          intensity={selectedId === 'education' ? 4.5 : isDimmed ? 0.0 : 0.6}
          distance={5}
          decay={2}
        />
        {(!isDimmed || selectedId === 'education') && (
          <Html
            position={[0, -0.38, 0]}
            center
            distanceFactor={7}
            className="select-none pointer-events-auto"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('education');
              }}
              aria-label="Education celestial object"
              className="cursor-pointer select-none py-0.5 px-1 focus:outline-none group flex flex-col items-center"
            >
              <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.32em] text-[#c9b78f]/75 group-hover:text-[#ffffff] group-hover:tracking-[0.40em] transition-all duration-300 uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                EDUCATION
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* ============================================================ */}
      {/* 5. SKILLS: Miniature Planetary System (Center-Right near Sun)*/}
      {/* ============================================================ */}
      <group
        ref={sklRef}
        position={BODIES_CONFIG[4].basePos}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect('skills');
        }}
      >
        <mesh>
          <sphereGeometry args={[0.24, 28, 28]} />
          <meshStandardMaterial
            color="#fcf8f0"
            emissive="#e8c785"
            emissiveIntensity={selectedId === 'skills' ? 1.6 : isDimmed ? 0.02 : 0.75}
            roughness={0.2}
          />
        </mesh>
        {/* Orbital rings */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.47, 0.49, 36]} />
          <meshBasicMaterial color="#c9b78f" transparent={true} opacity={isDimmed ? 0.03 : 0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.67, 0.69, 36]} />
          <meshBasicMaterial color="#e8c785" transparent={true} opacity={isDimmed ? 0.03 : 0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.87, 0.89, 36]} />
          <meshBasicMaterial color="#f3ebdd" transparent={true} opacity={isDimmed ? 0.02 : 0.16} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.09, 1.11, 36]} />
          <meshBasicMaterial color="#6f555e" transparent={true} opacity={isDimmed ? 0.02 : 0.18} side={THREE.DoubleSide} />
        </mesh>

        {/* 4 Orbiting Moons */}
        <mesh ref={moon1Ref} position={[0.48, 0, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#c9b78f" emissive="#c9b78f" emissiveIntensity={selectedId === 'skills' ? 1.0 : isDimmed ? 0.05 : 0.6} />
        </mesh>
        <mesh ref={moon2Ref} position={[0.68, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#e8c785" emissive="#e8c785" emissiveIntensity={selectedId === 'skills' ? 1.0 : isDimmed ? 0.05 : 0.6} />
        </mesh>
        <mesh ref={moon3Ref} position={[0.88, 0, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#f3ebdd" emissive="#f3ebdd" emissiveIntensity={selectedId === 'skills' ? 1.0 : isDimmed ? 0.05 : 0.6} />
        </mesh>
        <mesh ref={moon4Ref} position={[1.10, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#6f555e" emissive="#6f555e" emissiveIntensity={selectedId === 'skills' ? 1.0 : isDimmed ? 0.05 : 0.6} />
        </mesh>

        <pointLight
          color="#fcf8f0"
          intensity={selectedId === 'skills' ? 4.5 : isDimmed ? 0.0 : 0.9}
          distance={5}
          decay={2}
        />
        {(!isDimmed || selectedId === 'skills') && (
          <Html
            position={[0, -0.42, 0]}
            center
            distanceFactor={7}
            className="select-none pointer-events-auto"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('skills');
              }}
              aria-label="Skills planetary system celestial object"
              className="cursor-pointer select-none py-0.5 px-1 focus:outline-none group flex flex-col items-center"
            >
              <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.32em] text-[#c9b78f]/75 group-hover:text-[#ffffff] group-hover:tracking-[0.40em] transition-all duration-300 uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                SKILLS
              </span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

export default CoreStarBodies;
