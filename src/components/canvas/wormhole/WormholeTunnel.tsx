import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DestinationTravelConfig } from '../../../types/travel';

interface WormholeTunnelProps {
  config: DestinationTravelConfig;
  opacity: number;
  speed: number;
  twist: number;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uTwist;

  varying float vTunnelZ;
  varying float vAngle;
  varying vec3 vWorldNormal;

  void main() {
    // Cylinder is aligned along Y axis before group rotation (Y becomes Z)
    float zVal = position.y;
    vTunnelZ = zVal;

    // Angle around the tunnel perimeter
    float baseAngle = atan(position.z, position.x);
    // Spacetime rotational twist along length
    float twistedAngle = baseAngle + (zVal * 0.032 * uTwist);
    vAngle = twistedAngle;

    // Einstein-Rosen throat constriction near the center
    float throatFactor = 0.82 + 0.18 * smoothstep(0.0, 24.0, abs(zVal));

    // Gravitational spacetime ripples moving toward the camera
    float ripple = sin(zVal * 0.75 - uTime * 4.5) * 0.05 * uSpeed;
    float currentRadius = (throatFactor + ripple);

    // Reconstruct radial cross section
    float originalR = length(vec2(position.x, position.z));
    float newR = originalR * currentRadius;

    vec3 deformedPos = vec3(
      newR * cos(twistedAngle),
      zVal,
      newR * sin(twistedAngle)
    );

    vWorldNormal = normalize(normalMatrix * normal);

    vec4 mvPosition = modelViewMatrix * vec4(deformedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uAccentColor;

  varying float vTunnelZ;
  varying float vAngle;
  varying vec3 vWorldNormal;

  void main() {
    if (uOpacity < 0.005) {
      discard;
    }

    // 1. Concentric spacetime caustics / gravitational wave ripples
    float rings = sin(vTunnelZ * 1.25 + uTime * 5.8) * 0.5 + 0.5;
    rings = pow(rings, 3.5);

    // 2. Longitudinal starlight threads along the tunnel surface
    float threads = sin(vAngle * 14.0 + sin(vTunnelZ * 0.25 + uTime * 1.8)) * 0.5 + 0.5;
    threads = pow(threads, 4.0);

    // 3. Delicate soft stardust haze
    float haze = sin(vAngle * 3.0 - vTunnelZ * 0.15 + uTime * 2.2) * 0.5 + 0.5;

    // Dreamy, restrained starlight illumination (warm ivory & champagne palette)
    float pattern = rings * 0.50 + threads * 0.38 + haze * 0.12;

    vec3 baseColor = mix(uSecondaryColor, uPrimaryColor, rings * 0.7);
    vec3 accentGlow = mix(baseColor, uAccentColor, threads * 0.4);

    // Smooth entry and exit boundaries of the tunnel corridor
    float boundaryFade = smoothstep(-32.0, -18.0, vTunnelZ) * (1.0 - smoothstep(4.0, 18.0, vTunnelZ));

    // Subtle edge grazing sheen (Fresnel-like starlight rim)
    float rim = 0.55 + 0.45 * abs(vWorldNormal.z);

    float alpha = pattern * boundaryFade * rim * uOpacity * 0.42;

    gl_FragColor = vec4(accentGlow, alpha);
  }
`;

export const WormholeTunnel: React.FC<WormholeTunnelProps> = ({
  config,
  opacity,
  speed,
  twist,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uSpeed: { value: speed },
      uTwist: { value: twist },
      uPrimaryColor: { value: new THREE.Color(config.primaryColor) },
      uSecondaryColor: { value: new THREE.Color(config.secondaryColor) },
      uAccentColor: { value: new THREE.Color(config.accentColor) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.primaryColor, config.secondaryColor, config.accentColor]
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uOpacity.value = opacity;
    materialRef.current.uniforms.uSpeed.value = speed;
    materialRef.current.uniforms.uTwist.value = twist;
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry
          args={[
            config.tunnelRadius * 1.15, // radiusTop
            config.tunnelRadius * 1.15, // radiusBottom
            60,                         // height
            40,                         // radialSegments
            50,                         // heightSegments
            true,                       // openEnded
          ]}
        />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.BackSide}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
