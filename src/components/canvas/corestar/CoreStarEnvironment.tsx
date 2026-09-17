import React from 'react';
import { Destination } from '../../../types/navigation';

interface CoreStarEnvironmentProps {
  destination?: Destination | null;
  reducedMotion?: boolean;
}

/**
 * CoreStarEnvironment:
 * In Phase 5 experimental 2D/2.5D art direction, the Core Star destination
 * is rendered exclusively as a rich, layered 2D/2.5D animated illustration
 * in CoreStarWorld.tsx (HTML5 Canvas + CSS 2.5D Parallax).
 * Three.js meshes are disabled here to avoid redundant 3D rendering.
 */
export const CoreStarEnvironment: React.FC<CoreStarEnvironmentProps> = () => {
  return null;
};

export default CoreStarEnvironment;
