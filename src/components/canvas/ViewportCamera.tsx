import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ViewportCameraProps {
  reducedMotion?: boolean;
}

/**
 * ViewportCamera provides responsive camera configuration and subtle organic parallax.
 * Adapts distance on mobile screens and disables parallax when reduced motion is preferred.
 */
export const ViewportCamera: React.FC<ViewportCameraProps> = ({ reducedMotion = false }) => {
  const { camera, size } = useThree();
  const baseZ = useRef<number>(5);

  useEffect(() => {
    // Adapt base distance on mobile/portrait aspect ratios
    const isMobile = size.width < 768;
    baseZ.current = isMobile ? 6.8 : 5.2;
    camera.position.set(0, 0, baseZ.current);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  // Gentle camera parallax tied to pointer movement
  useFrame((state) => {
    if (reducedMotion) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseZ.current, 0.05);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Subtle, organic parallax without disorienting the viewer
    const targetX = state.pointer.x * 0.35;
    const targetY = state.pointer.y * 0.22;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.035);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseZ.current, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0, 5.2]}
      fov={58}
      near={0.1}
      far={1000}
    />
  );
};
